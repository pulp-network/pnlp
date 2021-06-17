import { EthereumAddress } from './ethereum';
import { Libp2pCryptoIdentity } from './keys';

export interface Identity {
  ipns_identity: Libp2pCryptoIdentity;
  ethereum_identity: EthereumAddress;
  ens_alias: string;
}
