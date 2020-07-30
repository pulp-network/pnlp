import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPFSHash, IPNSHash } from '../persistence/blockchain.service';

@Injectable({
  providedIn: 'root',
})
export class IpnsResolutionService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Currently the only known public mechanism for resolving IPNS is the textile website. They don't expose this
   * functionality in the API yet. Currently we're just scraping the HTML for this information.
   *
   * @param ipns
   */
  public async resolveIpns(ipns: IPNSHash): Promise<IPFSHash> {
    const response = await this.httpClient
      .get(`https://${ipns.value}.ipns.hub.textile.io/`, {
        headers: new HttpHeaders({
          Accept: 'text/html',
          'Content-Type': 'application/json',
        }),
        responseType: 'text',
      })
      .toPromise();

    // matches this from the textile site:  <span class="yellow">/:</span> /ipfs/bafybeicfpliv2eh25kv3w5bpl4h623ksurkj4q4lro4ac275pdm7h3kmuq
    const ipfs_regex = /<span.*ipfs\/(.*)\n/;

    const matches = ipfs_regex.exec(response);

    if (!matches[0].includes('span') || !matches[0].includes('ipfs') || !matches[1].length) {
      // this signals that the textile site may have changed and our scraper is broken
      throw new Error('The IPNS resolver is currently not working. Please contact pnlp development team on github.');
    }

    return new IPFSHash(matches[1]);
  }
}
