import { Injectable } from '@angular/core';
import { LinksReply, ListPathReply } from '@textile/buckets-grpc/buckets_pb';
import { Buckets, KeyInfo } from '@textile/hub';
import { IdentityService } from '../identity/identity.service';
import { IdentitySource } from '../identity/IdentitySource';

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

  public async writeData(path: string, content: any): Promise<LinksReply.AsObject> {
    await this.initializeBucketIfNecessary();

    const buf = Buffer.from(JSON.stringify(content, null, 2));
    console.debug(`Writing ${buf.length} bytes to ${path}`);
    await this.bucketMap.get(this.selectedBucketKey).pushPath(this.selectedBucketKey, path, buf);
    return this.bucketMap.get(this.selectedBucketKey).links(this.selectedBucketKey);
  }

  public async lsIpns(path: string): Promise<ListPathReply.AsObject> {
    await this.initializeBucketIfNecessary();

    // TODO DIMETRADON
    // Goal 1 List contents of IPNS directory here.
    // Subtask of goal if can't do in one call: Add IPNS resolver here.

    // TODO I am pretty sure that this next line is broken.
    return this.bucketMap.get(this.selectedBucketKey).listPath(this.selectedBucketKey, path);
  }

  public async catPathJson<T>(path: string, progress?: (num?: number) => void): Promise<T> {
    await this.initializeBucketIfNecessary();

    const request = this.bucketMap.get(this.selectedBucketKey).pullPath(this.selectedBucketKey, path, { progress });
    const { value } = await request.next();
    let str = '';
    for (var i = 0; i < value.length; i++) {
      str += String.fromCharCode(parseInt(value[i]));
    }
    const contents_as_json: T = JSON.parse(str);
    return contents_as_json;
  }

  public async catIpfsJson<T>(path: string, progress?: (num?: number) => void): Promise<T> {
    await this.initializeBucketIfNecessary();

    const request = this.bucketMap.get(this.selectedBucketKey).pullIpfsPath(path, { progress });
    const { value } = await request.next();
    let str = '';
    for (var i = 0; i < value.length; i++) {
      str += String.fromCharCode(parseInt(value[i]));
    }
    const contents_as_json: T = JSON.parse(str);
    return contents_as_json;
  }

  private async initBucketMap(): Promise<{ default_key: string; map: Map<string, Buckets> }> {
    console.debug('initializing bucket map...');

    // TODO: maybe we can kill identity service
    const identity = await this.identityService.getIdentity(IdentitySource.LIB_P2P_RANDOM);

    // TODO: talk to textile team about options here
    const buckets = await Buckets.withKeyInfo(this.auth);
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity);

    const root = await buckets.open('com.textile.io');
    if (!root) {
      throw new Error('Failed to open bucket');
    }

    const bucketMap = new Map();
    bucketMap.set(root.key, buckets);
    return { default_key: root.key, map: bucketMap };
  }
}
