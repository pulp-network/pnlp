import { Injectable } from '@angular/core';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { IdentitySource } from './IdentitySource';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private static LOCAL_STORAGE_KEY: string = 'identity';

  private identity: Libp2pCryptoIdentity;

  constructor() {}

  public async getIdentity(identitySource: IdentitySource, force_new?: boolean): Promise<Libp2pCryptoIdentity> {
    if (!force_new) {
      if (this.identity) {
        return this.identity;
      }
      try {
        var storedIdent = localStorage.getItem(IdentityService.LOCAL_STORAGE_KEY);
        if (storedIdent === null) {
          throw new Error('No identity');
        }
        const restored = await Libp2pCryptoIdentity.fromString(storedIdent);
        this.identity = restored;
        return restored;
      } catch (e) {
        console.debug('No identity set in local storage, creating new...');
      }
    }

    let identity;
    switch (identitySource) {
      case IdentitySource.METAMASK:
      case IdentitySource.PORTIS:
      case IdentitySource.TORUS:
        throw new Error('Unsupported identity source');
      case IdentitySource.LIB_P2P_RANDOM:
      default:
        identity = await Libp2pCryptoIdentity.fromRandom();
    }

    // Here I think we need to pass in from keystore service the identity?
    const identityString = identity.toString();
    localStorage.setItem(IdentityService.LOCAL_STORAGE_KEY, identityString);
    this.identity = identity;
    return identity;
  }
}
