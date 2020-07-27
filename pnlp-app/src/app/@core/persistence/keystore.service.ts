import { Injectable } from '@angular/core';
import { EthereumAddress, BlockchainService } from './blockchain.service';
import { keys as libp2p_crypto_keys } from 'libp2p-crypto';
// import { keys as threads_crypto_keys } from '@textile/threads-crypto';
import { utils, BigNumber } from 'ethers';
import { Ed25519PrivateKey as threads_crypto_Ed25519PrivateKey } from '@textile/threads-crypto/dist/ed25519';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

@Injectable({
  providedIn: 'root',
})
export class KeystoreService {
  // From https://github.com/textileio/js-threads/blob/master/packages/crypto/src/ed25519.ts
  private readonly constants = {
    PUBLIC_KEY_BYTE_LENGTH: 32,
    PRIVATE_KEY_BYTE_LENGTH: 32,
    SEED_BYTE_LENGTH: 32,
    SIGN_BYTE_LENGTH: 64,
    HASH_BYTE_LENGTH: 64,
  };

  constructor(private blockchainService: BlockchainService) {}

  public async generateLibp2pCryptoIdentity(): Promise<Libp2pCryptoIdentity> {
    return new Libp2pCryptoIdentity(await this.generateKeyPair());
  }

  // Modified from https://github.com/textileio/js-threads/blob/master/packages/crypto/src/ed25519.ts
  private async generateKeyPair(): Promise<threads_crypto_Ed25519PrivateKey> {
    const key: libp2p_crypto_keys.supportedKeys.ed25519.Ed25519PrivateKey = await this.generatePrivateKey();
    // The above line was:
    // await libp2p_crypto_keys.supportedKeys.ed25519.generateKeyPair()
    const bytes = key.marshal();
    const privateKey = bytes.slice(0, this.constants.PRIVATE_KEY_BYTE_LENGTH);
    const publicKey = bytes.slice(
      this.constants.PRIVATE_KEY_BYTE_LENGTH,
      this.constants.PRIVATE_KEY_BYTE_LENGTH + this.constants.PUBLIC_KEY_BYTE_LENGTH
    );
    return new threads_crypto_Ed25519PrivateKey(privateKey, publicKey);
  }

  private generateMessageForEntropy(ethereum_address: EthereumAddress, application_name: string): string {
    return (
      '******************************************************************************** \n' +
      'READ THIS MESSAGE CAREFULLY. \n' +
      'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
      'ACCESS TO THIS APPLICATION. \n' +
      'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
      'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
      '******************************************************************************** \n' +
      'The Ethereum address used by this application is: \n' +
      '\n' +
      ethereum_address.value.toHexString() +
      '\n' +
      '\n' +
      '\n' +
      'By signing this message, you authorize the current application to use the \n' +
      'following app associated with the above address: \n' +
      '\n' +
      application_name +
      '\n' +
      '\n' +
      '\n' +
      '******************************************************************************** \n' +
      'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
      'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
      'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
      'WRITE ACCESS TO THIS APPLICATION. \n' +
      '******************************************************************************** \n'
    );
  }

  private async generatePrivateKey(): Promise<libp2p_crypto_keys.supportedKeys.ed25519.Ed25519PrivateKey> {
    const ethereumAddress = await this.blockchainService.getAccount();
    const message = this.generateMessageForEntropy(ethereumAddress, 'pnlp');
    const signedText = await this.blockchainService.signText(message);
    const hash = utils.keccak256(signedText);
    // The following line converts the hash in hex to an array of 32 integers.
    const array = hash
      .replace('0x', '') // Gets rid of the '0x' prefix
      .match(/.{2}/g) // Segments the string each two hex charachers. Each element of the array is one binary digit.
      .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber()); // Convert hex string to number
    if (array.length !== 32) {
      throw new Error('Hash of signerature is not the correct size! Something bad went wrong!');
    }

    // I looked through the library. This is the function that Textile uses Ed25519 deep down.
    // I also pass 1024 bits to this function, but it appears as if it is never used!
    // I think the number of bits is used for other crypto functions.
    return await libp2p_crypto_keys.generateKeyPairFromSeed('Ed25519', Uint8Array.from(array), 1024);
  }
}
