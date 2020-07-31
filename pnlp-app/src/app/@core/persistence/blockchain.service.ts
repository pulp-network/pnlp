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

export class EthereumTransaction extends StrongType<'ethereum_tx', string> {}
export class EthereumAddress extends StrongType<'ethereum_address', string> {}

export class PublicationRecord {
  constructor(public ipns_hash: IPNSHash, public author: EthereumAddress, public timestamp: Date) {}
}

class ArticleRecord {
  constructor(public author: EthereumAddress, public timestamp: Date) {}
}

class BlockchainError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BlockchainError.prototype);
  }
}

export type TransactionResult = {
  hash: string;
  // TODO:TX_RESULT fill out type (or import from ethers if they have one?)
};

type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum?: providers.ExternalProvider };

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  private contractAbi = ContractJson.abi;
  private contractAddress: EthereumAddress = new EthereumAddress('0x32adb755284b6fc1603b7569296ce5bea8949175');

  private provider: providers.Web3Provider;
  private signer: providers.JsonRpcSigner;
  private contract: Contract;

  private initialized = false;

  public async createPublication(publication_slug: string, ipns_hash: IPNSHash): Promise<TransactionResult> {
    if (!this.initialized) {
      this.init();
    }

    try {
      console.debug(`creating publication on ethereum: ${publication_slug}:${ipns_hash.value}`);
      const transaction = await this.contract.functions.createPublication(publication_slug, ipns_hash.value);
      console.debug('transaction result: ', transaction);
      return transaction;
    } catch (error) {
      console.error(error);
      if (!!error && !!error.data && !!error.data.message) {
        throw new BlockchainError(error.data.message.replace('VM Exception while processing transaction: revert ', ''));
      }
    }
  }

  public async getPublication(publication_slug: string): Promise<PublicationRecord | null> {
    if (!this.initialized) {
      this.init();
    }

    type EthereumPublication = [string, string, BigNumber] & {
      ipnsHash: string;
      author: string;
      timestamp: BigNumber;
    };
    console.debug(`fetching publication ${publication_slug} from ethereum blockchain...`);

    // TODO:ERROR_1:
    // call revert exception (method="publications(string)", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.0.1)
    const publication: EthereumPublication = await this.contract.functions.publications(publication_slug);
    console.log('publication: ', publication);
    if (!publication) {
      throw new BlockchainError('Cannot get publication');
    }

    // If a publication_slug does not exist, it will return a null publication.
    if (
      publication.ipnsHash === '' &&
      publication.author === '0x0000000000000000000000000000000000000000' &&
      publication.timestamp.toHexString() === '0x00'
    ) {
      console.debug(`publication did not exist...`);
      return null;
    }
    console.debug(
      `found publication at ${publication.ipnsHash} published by ${publication.author} on ${publication.timestamp}`
    );

    const pub_record = new PublicationRecord(
      new IPNSHash(publication.ipnsHash.replace('ipns/', '')),
      new EthereumAddress(publication.author),
      new Date(publication.timestamp.toNumber() * 1000)
    );
    return pub_record;
  }

  public async getArticle(ipfs_hash: IPFSHash): Promise<ArticleRecord | null> {
    if (!this.initialized) {
      this.init();
    }

    type EthereumPublication = [string, BigNumber] & { author: string; timestamp: BigNumber };
    const article: EthereumPublication = await this.contract.functions.articles(ipfs_hash);
    console.log(article);
    if (!article) {
      throw new BlockchainError('Cannot get publication');
    }

    // If an ipfs_hash does not exist, it will return a null article.
    if (article.author === '0x0000000000000000000000000000000000000000' && article.timestamp.toHexString() === '0x00') {
      return null;
    }

    return new ArticleRecord(new EthereumAddress(article.author), new Date(article.timestamp.toNumber() * 1000));
  }

  public async publishArticle(publication_slug: string, ipfs_hash: IPFSHash): Promise<TransactionResult> {
    if (!this.initialized) {
      this.init();
    }

    try {
      console.debug(`creating article on ethereum: ${publication_slug}:${ipfs_hash.value}`);

      //TODO:ERROR_2:
      //   blockchain.service.ts:145 TypeError: Cannot read property 'length' of undefined
      // at Object.toUtf8Bytes (ethers.umd.js:7587)
      // at StringCoder.encode (ethers.umd.js:7973)
      // at ethers.umd.js:6966
      // at Array.forEach (<anonymous>)
      // at Object.pack (ethers.umd.js:6960)
      // at TupleCoder.encode (ethers.umd.js:8022)
      // at AbiCoder.encode (ethers.umd.js:8121)
      // at Interface._encodeParams (ethers.umd.js:8452)
      // at Interface.encodeFunctionData (ethers.umd.js:8475)
      // at ethers.umd.js:9438
      const transaction = await this.contract.functions.publishArticle(publication_slug, ipfs_hash.value);
      console.debug('transaction result: ', transaction);
      return transaction;
    } catch (error) {
      console.error(error);
      if (!!error && !!error.data && !!error.data.message) {
        throw new BlockchainError(error.data.message.replace('VM Exception while processing transaction: revert ', ''));
      }
    }
  }

  public async getAccount(): Promise<EthereumAddress> {
    if (!this.initialized) {
      this.init();
    }

    const accounts = await (window as WindowInstanceWithEthereum).ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new BlockchainError('No account is provided. Please provide an account to this application.');
    }

    return new EthereumAddress(accounts[0]);
  }

  public async signText(text: string): Promise<string> {
    if (!this.initialized) {
      this.init();
    }

    return await this.signer.signMessage(text);
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

    console.debug('initializing web3 provider...');
    this.provider = new providers.Web3Provider((window as WindowInstanceWithEthereum).ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new Contract(this.contractAddress.value, this.contractAbi, this.signer);

    this.initialized = true;
  }
}
