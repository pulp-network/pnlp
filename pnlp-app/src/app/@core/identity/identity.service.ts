import { Injectable } from '@angular/core';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlockchainService, EthereumAddress } from '../persistence/blockchain.service';
import { KeystoreService } from '../persistence/keystore.service';

export type PnlpIdentity = {
  ipns_identity: Libp2pCryptoIdentity;
  ethereum_identity: EthereumAddress;
  ens_alias: string;
};

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  public identity: BehaviorSubject<PnlpIdentity> = new BehaviorSubject(null);
  public observableIdentity: Observable<PnlpIdentity> = this.identity.asObservable();

  constructor(private keystoreService: KeystoreService, private blockchainService: BlockchainService) {}

  public async loadEthereumAddress() {
    const ethereumAddress = await this.blockchainService.getAccount();
    const ens_alias = await this.blockchainService.lookupAddress(ethereumAddress);
    this.identity.next({
      ipns_identity: undefined,
      ethereum_identity: ethereumAddress,
      ens_alias: ens_alias,
    });
  }

  public async initalizeIdentity(): Promise<void> {
    if (!!this.identity.getValue()) {
      return;
    }
    const ethereumAddress = await this.blockchainService.getAccount();
    const ens_alias = await this.blockchainService.lookupAddress(ethereumAddress);
    const ipns_identity = await this.keystoreService.generateLibp2pCryptoIdentity(ethereumAddress);
    this.identity.next({
      ipns_identity,
      ethereum_identity: ethereumAddress,
      ens_alias: ens_alias,
    });
  }

  public async signout(): Promise<void> {
    this.identity.next(null);
  }
}
