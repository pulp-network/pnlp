import { Article, ArticleValidator } from '@app/model/article';
import { PnlpConstant } from '@app/model/constants';
import { EnsName, EthereumAddress, IpfsHash, IpnsHash, TransactionResult } from '@app/model/ethereum';
import { Publication, PublicationMetadata, PublicationRecord, PublicationValidator } from '@app/model/publication';
import { Validator } from '@app/model/validation';

export interface BlockchainService {
  createPublication(publication_slug: string, ipns_address: IpnsHash): Promise<TransactionResult>;

  getPublication(publication_slug: string): Promise<PublicationRecord>;

  publishArticle(publication_slug: string, ipfs_hash: IpfsHash): Promise<TransactionResult>;

  lookupEns(address: EthereumAddress): Promise<EnsName | EthereumAddress>;
}

export interface IpfsService {
  writeData(path: string, buffer: Buffer): Promise<IpnsHash>;

  catIpfsJson<T>(path: string): Promise<T>;

  resolveIpns(ipns_hash: IpnsHash): Promise<IpfsHash>;

  lsIpns(path: string): Promise<string[]>;
}

/**
 * TODO: The PnlpClient and associated interfaces and types should eventually be split into its own library.
 * TODO: Include interfaces for signing transactions and updating IPNS directories here.
 * TODO: Include "establishIdentity" here.
 *
 * This is the reference client for the pnlp protocol.
 */
export class PnlpClient {
  constructor(private blockchain_service: BlockchainService, private ipfs_service: IpfsService) {}

  public async createPublication(publication: Publication): Promise<PublicationMetadata> {
    Validator.throwIfInvalid(publication, PublicationValidator);

    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);

    const buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    const ipns_address = await this.ipfs_service.writeData(path, buffer);
    console.debug('ipns_address: ', ipns_address);

    const transaction = await this.blockchain_service.createPublication(publication.slug, ipns_address);

    return {
      transaction,
      publication,
      ipns_address,
    };
  }

  public async getPublication(publication_slug: string): Promise<Publication> {
    console.debug(`fetching ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns_hash);

    const path = `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`;
    const publication = await this.ipfs_service.catIpfsJson<Publication>(path);

    Validator.throwIfInvalid(publication, PublicationValidator);
    return publication;
  }

  public async listPublications(): Promise<string[]> {
    console.debug(`listing publications...`);
    const files = await this.ipfs_service.lsIpns(PnlpConstant.ROOT);
    if (!files) {
      throw new Error(`The root publication path does not exist or is not visible`);
    }
    return files.filter((f) => PnlpConstant.RESERVED_NAMES.every((r) => f !== r));
  }

  public async createArticle(
    publication_slug: string,
    article: Article
  ): Promise<{ transaction: TransactionResult; ipns_address: IpnsHash; ipfs_address: IpfsHash }> {
    Validator.throwIfInvalid(article, ArticleValidator);
    console.debug(
      `publishing article ${article.slug}; ${article.content.title}; subtitle length ${article.content.subtitle?.length}; content length ${article.content.body.length}`
    );

    const article_buffer = Buffer.from(JSON.stringify(article, null, 2));
    const article_path = `${publication_slug}/${article.slug}`;
    const ipns_address = await this.ipfs_service.writeData(article_path, article_buffer);
    console.debug('ipns_address: ', ipns_address);

    const bucket_address = await this.ipfs_service.resolveIpns(ipns_address);
    const ipfs_address = `${bucket_address}/${publication_slug}/${article.slug}`;

    const transaction = await this.blockchain_service.publishArticle(publication_slug, ipfs_address);

    // update publication with new transaction ID and article slug
    const publication = await this.getPublication(publication_slug);
    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transaction.hash,
      title: article.content.title,
      ipfs_address: ipfs_address,
      author: article.author,
      subtitle: article.content.subtitle,
      timestamp: article.timestamp,
    };

    const publication_buffer = Buffer.from(JSON.stringify(publication, null, 2));
    const publication_path = `${publication.slug}/${PnlpConstant.INDEX_FILENAME}`;
    this.ipfs_service.writeData(publication_path, publication_buffer);

    return {
      transaction,
      ipns_address,
      ipfs_address,
    };
  }

  public async getArticle(
    publication_slug: string,
    article_index: string
  ): Promise<{ publication: Publication; article: Article; author_alias: string }> {
    console.debug(`fetching article: ${publication_slug}/${article_index}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns_hash);

    const article = await this.ipfs_service.catIpfsJson<Article>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${article_index}`
    );

    const publication = await this.ipfs_service.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`
    );

    if (!article) {
      throw new Error(`Article pulp/${publication_slug}/${article_index} does not exist or is not visible`);
    }

    let author_alias = await this.blockchain_service.lookupEns(article.author);
    if (!author_alias) {
      author_alias = article.author;
    }

    Validator.throwIfInvalid(article, ArticleValidator);
    return {
      publication,
      article,
      author_alias,
    };
  }

  public async listArticles(
    publication_slug: string
  ): Promise<{ publication: Publication; metadata: PublicationRecord; author_alias_map: { [key: string]: string } }> {
    console.debug(`listing articles from: ${publication_slug}...`);

    const publication_record = await this.blockchain_service.getPublication(publication_slug);

    console.log(JSON.stringify(publication_record));

    const ipfs_hash = await this.ipfs_service.resolveIpns(publication_record.ipns_hash);

    const publication = await this.ipfs_service.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${PnlpConstant.INDEX_FILENAME}`
    );

    const author_alias_map = {};
    for (const article of Object.values(publication.articles)) {
      if (!author_alias_map[article.author]) {
        author_alias_map[article.author] = article.author;
        const ens_alias = await this.blockchain_service.lookupEns(article.author);
        if (ens_alias) {
          author_alias_map[article.author] = ens_alias;
        } else {
          author_alias_map[article.author] = article.author;
        }
      }
    }

    return {
      metadata: publication_record,
      publication,
      author_alias_map,
    };
  }
}
