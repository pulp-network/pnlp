import { Injectable } from '@angular/core';
import { Article, ArticleValidator } from '@app/model/article';
import { IpfsHash, IpnsHash } from '@app/model/ethereum';
import { Publication, PublicationValidator } from '@app/model/publication';
import { Validator } from '@app/model/validation';
import { BlockchainService, PublicationRecord, TransactionResult } from '../persistence/blockchain.service';
import { PersistenceService } from '../persistence/persistence.service';
import { IpnsResolutionService } from '../resolution/ipns-resolution.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private static INDEX_FILENAME = '.pnlp.json';
  private static RESERVED_NAMES = ['.textileseed'];
  private static ROOT = '/';

  constructor(
    private persistenceService: PersistenceService,
    private blockchainService: BlockchainService,
    private ipnsResolutionService: IpnsResolutionService
  ) {}

  public async createPublication(
    publication: Publication
  ): Promise<{ publication: Publication; ipns_address: IpnsHash; transaction: TransactionResult }> {
    Validator.throwIfInvalid(publication, PublicationValidator);

    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);
    const ipns_address = await this.persistenceService.writeData(
      `${publication.slug}/${PublicationService.INDEX_FILENAME}`,
      publication
    );
    console.debug('ipns_address: ', ipns_address);

    const transaction = await this.blockchainService.createPublication(publication.slug, ipns_address);

    return {
      transaction,
      publication,
      ipns_address,
    };
  }

  public async createArticle(
    publication_slug: string,
    article: Article
  ): Promise<{ transaction: TransactionResult; ipns_address: IpnsHash; ipfs_address: IpfsHash }> {
    Validator.throwIfInvalid(article, ArticleValidator);
    console.debug(
      `publishing article ${article.slug}; ${article.content.title}; subtitle length ${article.content.subtitle?.length}; content length ${article.content.body.length}`
    );

    const ipns_address = await this.persistenceService.writeData(`${publication_slug}/${article.slug}`, article);
    console.debug('ipns_address: ', ipns_address);

    const bucket_address = await this.ipnsResolutionService.resolveIpns(ipns_address);
    const ipfs_address = `${bucket_address}/${publication_slug}/${article.slug}`;

    const transaction = await this.blockchainService.publishArticle(publication_slug, ipfs_address);
    // update publication with new transaction ID and article slug
    await this.addArticleToPublicationIndex(publication_slug, article, transaction.hash, ipfs_address);

    return {
      transaction,
      ipns_address,
      ipfs_address,
    };
  }

  public async getPublication(publication_slug: string): Promise<Publication> {
    console.debug(`fetching ${publication_slug}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    const publication = await this.persistenceService.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
    );

    Validator.throwIfInvalid(publication, PublicationValidator);
    return publication;
  }

  public async listPublications(): Promise<string[]> {
    console.debug(`listing publications...`);
    const items = await this.persistenceService.lsIpns(PublicationService.ROOT);
    if (!items) {
      throw new Error(`The root publication path does not exist or is not visible`);
    }
    return items.filter((i) => PublicationService.RESERVED_NAMES.every((r) => i !== r));
  }

  public async listArticles(
    publication_slug: string
  ): Promise<{ publication: Publication; metadata: PublicationRecord; author_alias_map: { [key: string]: string } }> {
    console.debug(`listing articles from: ${publication_slug}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    const publication = await this.persistenceService.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
    );

    const author_alias_map = {};
    for (const article of Object.values(publication.articles)) {
      if (!author_alias_map[article.author]) {
        author_alias_map[article.author] = article.author;
        const ens_alias = await this.blockchainService.lookupEns(article.author);
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

  public async getArticle(
    publication_slug: string,
    article_index: string
  ): Promise<{ publication: Publication; article: Article; author_alias: string }> {
    console.debug(`fetching article: ${publication_slug}/${article_index}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    const article = await this.persistenceService.catIpfsJson<Article>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${article_index}`
    );

    const publication = await this.persistenceService.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
    );

    if (!article) {
      throw new Error(`Article pulp/${publication_slug}/${article_index} does not exist or is not visible`);
    }

    let author_alias = await this.blockchainService.lookupEns(article.author);
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

  private async addArticleToPublicationIndex(
    publication_slug: string,
    article: Article,
    transactionHash: string,
    ipfs_hash: IpfsHash
  ): Promise<IpnsHash> {
    const publication = await this.getPublication(publication_slug);
    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transactionHash,
      title: article.content.title,
      ipfs_address: ipfs_hash,
      author: article.author,
      subtitle: article.content.subtitle,
      timestamp: article.timestamp,
    };

    return this.persistenceService.writeData(`${publication.slug}/${PublicationService.INDEX_FILENAME}`, publication);
  }
}
