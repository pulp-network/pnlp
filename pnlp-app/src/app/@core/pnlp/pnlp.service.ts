import { Injectable } from '@angular/core';
import { PnlpClient } from '@app/model/client';
import { BlockchainService } from '../persistence/blockchain.service';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable({
  providedIn: 'root',
})
export class PnlpService {
  public pnlpClient: PnlpClient;

  constructor(private persistenceService: PersistenceService, private blockchainService: BlockchainService) {
    this.pnlpClient = new PnlpClient(this.blockchainService, this.persistenceService);
  }
}
