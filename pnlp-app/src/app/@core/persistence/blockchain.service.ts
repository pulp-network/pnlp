import { Injectable } from '@angular/core';
import { BigNumber, Contract, providers } from 'ethers';

// If this line fails when you build, please run `truffle build` from `pnlp-contract`.
import ContractJson from '../../../../../pnlp-contract/build/contracts/pnlp.json';

class StrongType<Definition, Type> {
  private _type: Definition;
  constructor(public value?: Type) {}
}

export class IPNSHash extends StrongType<'ipns', string> {}
export class IPFSHash extends StrongType<'ipfs', string> {}
export class EthereumAddress extends StrongType<'ethereum_address', BigNumber> {}

export class Publication {
  constructor(public ipns_hash: IPNSHash, public publisher: EthereumAddress, public timestamp: Date) {}
}

class Article {
  constructor(public publisher: EthereumAddress, public timestamp: Date) {}
}

class BlockchainError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BlockchainError.prototype);
  }
}

type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum?: providers.ExternalProvider };

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  private contractAbi = ContractJson.abi;
  private contractAddress: EthereumAddress = new EthereumAddress(
    BigNumber.from('0x6038b800C8836A70691e23bdF775F0813Cb714f8')
  );

  private provider: providers.Web3Provider;
  private signer: providers.JsonRpcSigner;
  private contract: Contract;

  private initialized = false;

  public async createPublication(publication_subdomain: string, inps_hash: IPNSHash) {
    if (!this.initialized) {
      this.init();
    }

    try {
      await this.contract.functions.createPublication(publication_subdomain, inps_hash.value);
    } catch (error) {
      console.error(error);
      if (!!error && !!error.data && !!error.data.message) {
        throw new BlockchainError(error.data.message.replace('VM Exception while processing transaction: revert ', ''));
      }
    }
  }

  public async getPublication(publication_subdomain: string): Promise<Publication | null> {
    if (!this.initialized) {
      this.init();
    }

    type EthereumPublication = [string, string, BigNumber] & {
      ipnsHash: string;
      publisher: string;
      timestamp: BigNumber;
    };
    const publication: EthereumPublication = await this.contract.functions.publications(publication_subdomain);
    console.log(publication);
    if (!publication) {
      throw new BlockchainError('Cannot get publication');
    }

    // If a publication_subdomain does not exist, it will return a null publication.
    if (
      publication.ipnsHash === '' &&
      publication.publisher === '0x0000000000000000000000000000000000000000' &&
      publication.timestamp.toHexString() === '0x00'
    ) {
      return null;
    }

    return new Publication(
      new IPNSHash(publication.ipnsHash),
      new EthereumAddress(BigNumber.from(publication.publisher)),
      new Date(publication.timestamp.toNumber())
    );
  }

  public async getArticle(ipfs_hash: IPFSHash): Promise<Article | null> {
    if (!this.initialized) {
      this.init();
    }

    type EthereumPublication = [string, BigNumber] & { publisher: string; timestamp: BigNumber };
    const article: EthereumPublication = await this.contract.functions.articles(ipfs_hash);
    console.log(article);
    if (!article) {
      throw new BlockchainError('Cannot get publication');
    }

    // If a ipfs_hash does not exist, it will return a null article.
    if (
      article.publisher === '0x0000000000000000000000000000000000000000' &&
      article.timestamp.toHexString() === '0x00'
    ) {
      return null;
    }

    return new Article(new EthereumAddress(BigNumber.from(article.publisher)), new Date(article.timestamp.toNumber()));
  }

  public async publishArticle(publication_subdomain: string, ipfs_hash: IPFSHash) {
    if (!this.initialized) {
      this.init();
    }

    try {
      await this.contract.functions.publishArticle(publication_subdomain, ipfs_hash.value);
    } catch (error) {
      console.error(error);
      if (!!error && !!error.data && !!error.data.message) {
        throw new BlockchainError(error.data.message.replace('VM Exception while processing transaction: revert ', ''));
      }
    }
  }

  private async revertWrapper(wrappedFunction: () => void) {
    if (!this.initialized) {
      this.init();
    }

    try {
      await wrappedFunction();
    } catch (error) {
      console.error(error);
      if (!!error && !!error.data && !!error.data.message) {
        throw new BlockchainError(error.data.message.replace('VM Exception while processing transaction: revert ', ''));
      }
    }
  }

  private async signText(text: string): Promise<string> {
    if (!this.initialized) {
      this.init();
    }

    return await this.signer.signMessage(text);
  }

  private init() {
    if (!this.contractAddress) {
      throw new BlockchainError(
        'The contractAddress for pnlp is not defined. If you see this in production, please create a github issue for the pnlp team.'
      );
    }

    if (!(window as WindowInstanceWithEthereum).ethereum) {
      throw new BlockchainError(
        'Ethereum is not connected. Please download Metamask from https://metamask.io/download.html'
      );
    }

    this.provider = new providers.Web3Provider((window as WindowInstanceWithEthereum).ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new Contract(this.contractAddress.value.toHexString(), this.contractAbi, this.signer);

    this.initialized = true;
  }

  private async getAccount(): Promise<string> {
    if (!this.initialized) {
      this.init();
    }

    const accounts = await (window as WindowInstanceWithEthereum).ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new BlockchainError('No account is provided. Please provide an account to this application.');
    }

    return accounts[0];
  }

  // Move this function to another service at some point
  private messageForEntropyGeneration(ethereum_address: EthereumAddress, application_name: string): string {
    return (
      '******************************************************************************** \
      READ THIS MESSAGE CAREFULLY. \
      DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \
      ACCESS TO THIS APPLICATION. \
      DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \
      TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \
      ******************************************************************************** \
      The Ethereum address used by this application is: \
      \
      ' +
      ethereum_address.value.toHexString() +
      '\
      By signing this message, you authorize the current application to use the \
      following app associated with the above address:\
      \
      ' +
      application_name +
      '\
      ******************************************************************************** \
      ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \
      ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \
      AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \
      WRITE ACCESS TO THIS APPLICATION. \
      ********************************************************************************'
    );
  }
}
