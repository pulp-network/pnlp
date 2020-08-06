import { Injectable } from '@angular/core';
import { LinksReply, ListPathReply } from '@textile/buckets-grpc/buckets_pb';
import { Buckets, KeyInfo } from '@textile/hub';
import { IdentityService } from '../identity/identity.service';
import { IPNSHash } from './blockchain.service';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private bucketMap: Map<string, Buckets> = new Map();

  private selectedBucketKey: string;

  // TODO:11: pull this out into environment.ts
  // this is an insecure key from textile hub. it is okay to share and publish on github.
  // do NOT put production secure keys here.
  private auth: KeyInfo = {
    key: 'bf6prh2flvxsbtil6rqwcrp3kxa',
    secret: '',
  };

  constructor(private identityService: IdentityService) {}

  public static mapLinksToIpns(links: LinksReply.AsObject): IPNSHash {
    const ipns_string = links.ipns.replace('https://hub.textile.io/ipns/', '');
    return new IPNSHash(ipns_string);
  }

  public async writeData(path: string, content: any): Promise<IPNSHash> {
    await this.initializeBucketIfNecessary();

    const buf = Buffer.from(JSON.stringify(content, null, 2));
    console.debug(`Writing ${buf.length} bytes to ${path}`);
    await this.bucketMap.get(this.selectedBucketKey).pushPath(this.selectedBucketKey, path, buf);
    const links_reply = await this.bucketMap.get(this.selectedBucketKey).links(this.selectedBucketKey);
    return PersistenceService.mapLinksToIpns(links_reply);
  }

  public async lsIpns(path: string): Promise<ListPathReply.AsObject> {
    await this.initializeBucketIfNecessary();
    console.debug(`listPath: ${path}`);
    return this.bucketMap.get(this.selectedBucketKey).listPath(this.selectedBucketKey, path);
  }

  public async catPathJson<T>(path: string, progress?: (num?: number) => void): Promise<T> {
    await this.initializeBucketIfNecessary();
    console.debug(`pullPath: ${path}`);
    const request = this.bucketMap.get(this.selectedBucketKey).pullPath(this.selectedBucketKey, path, { progress });
    return await this.convertRequestToJson(request);
  }

  public async catIpfsJson<T>(path: string, progress?: (num?: number) => void): Promise<T> {
    await this.initializeBucketIfNecessary();
    console.debug(`pullIpfsPath: ${path}`);
    const request = this.bucketMap.get(this.selectedBucketKey).pullIpfsPath(path, { progress });
    return await this.convertRequestToJson(request);
  }

  private async convertRequestToJson<T>(request: AsyncIterableIterator<Uint8Array>): Promise<T> {
    const { value } = await request.next();
    const res = new TextDecoder('utf-8').decode(value);
    const contents_as_json: T = JSON.parse(res);
    return contents_as_json;
  }

  private async initializeBucketIfNecessary() {
    if (!this.isInitialized()) {
      const { default_key, map } = await this.initBucketMap();
      this.selectedBucketKey = default_key;
      this.bucketMap = map;
    }
  }

  private isInitialized() {
    return this.selectedBucketKey && this.bucketMap && this.bucketMap.size;
  }

  private async initBucketMap(): Promise<{ default_key: string; map: Map<string, Buckets> }> {
    console.debug('initializing bucket map...');

    const buckets = await Buckets.withKeyInfo(this.auth);

    await this.identityService.initalizeIdentity(); // TODO: can we remove this for read-only pages?
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(this.identityService.identity.value.ipns_identity);

    const root = await buckets.open('com.textile.io');
    if (!root) {
      throw new Error('Failed to open bucket');
    }

    const bucketMap = new Map();
    bucketMap.set(root.key, buckets);
    return { default_key: root.key, map: bucketMap };
  }
}