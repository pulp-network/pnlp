import {
  AuthorAddress,
  EthereumAddress,
  EthereumTransaction,
  IpfsHash,
  IpnsHash,
  TransactionResult,
} from '@app/model/ethereum';

export interface PublicationRecord {
  ipns_hash: IpfsHash;
  author: EthereumAddress;
  timestamp: Date;
}

export interface PublicationMetadata {
  publication: Publication;
  ipns_address: IpnsHash;
  transaction: TransactionResult;
}

export interface Publication {
  slug: string;
  owner: AuthorAddress;
  name: string;
  description: string;
  articles: {
    [article_slug: string]: ArticleSummary;
  };
}

export interface ArticleSummary {
  tx: EthereumTransaction;
  ipfs_address: IpfsHash;
  author: EthereumAddress;
  title: string;
  subtitle: string;
  timestamp: Date;
}

export const ValidPublicationSlug = /^[a-z0-9-]+$/;

export const PublicationValidator = (publication: Publication): string => {
  let err = '';
  let delimiter = '';
  if (!publication.slug) {
    err += delimiter + 'slug';
    delimiter = ', ';
  }
  if (!publication.name) {
    err += delimiter + 'name';
    delimiter = ', ';
  }
  // validate other required fields under metadata...
  if (err) {
    return 'Publication missing required fields: ' + err;
  } else {
    return '';
  }
};
