import { Injectable } from '@angular/core';
import { EthereumAddress, BlockchainService } from './blockchain.service';

@Injectable({
  providedIn: 'root',
})
export class KeystoreService {
  constructor(private blockchainService: BlockchainService) {}

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
      '\n' +
      ethereum_address.value.toHexString() +
      '\n' +
      'By signing this message, you authorize the current application to use the \n' +
      'following app associated with the above address:\n' +
      '\n' +
      '\n' +
      application_name +
      '\n' +
      '******************************************************************************** \n' +
      'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
      'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
      'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
      'WRITE ACCESS TO THIS APPLICATION. \n' +
      '******************************************************************************** \n'
    );
  }

  private async generatePrivateKey() {
    const ethereumAddress = await this.blockchainService.getAccount();
    const message = this.generateMessageForEntropy(ethereumAddress, 'pnlp');
    const signedText = await this.blockchainService.signText(message);
  }
}
