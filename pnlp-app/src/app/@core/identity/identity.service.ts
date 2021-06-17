import { Injectable } from '@angular/core';
import { Identity } from '@app/model/identity';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlockchainService } from '../persistence/blockchain.service';
import { KeystoreService } from '../persistence/keystore.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  public identity: BehaviorSubject<Identity> = new BehaviorSubject(null);
  public observableIdentity: Observable<Identity> = this.identity.asObservable();

  constructor(private keystoreService: KeystoreService, private blockchainService: BlockchainService) {}

  public async loadEthereumAddress() {
    const ethereumAddress = await this.blockchainService.getAccount();
    const ens_alias = await this.blockchainService.lookupEns(ethereumAddress);
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
    const ens_alias = await this.blockchainService.lookupEns(ethereumAddress);
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
