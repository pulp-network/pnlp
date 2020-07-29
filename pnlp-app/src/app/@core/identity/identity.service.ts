import { Injectable } from '@angular/core';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { IdentitySource } from './IdentitySource';
import { KeystoreService } from '../persistence/keystore.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  public identity: BehaviorSubject<Libp2pCryptoIdentity> = new BehaviorSubject(null);
  public observableIdentity: Observable<Libp2pCryptoIdentity> = this.identity.asObservable();

  constructor(private keystoreService: KeystoreService) {}

  // TODO The sign-in button needs to call this
  public async initalizeIdentity(): Promise<void> {
    this.identity.next(await this.keystoreService.generateLibp2pCryptoIdentity());
  }
}
