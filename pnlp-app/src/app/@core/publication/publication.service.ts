import { Injectable } from '@angular/core';
import { LinksReply } from '@textile/buckets-grpc/buckets_pb';
import { Article, ArticleValidator } from '../../model/Article';
import { Publication, PublicationValidator } from '../../model/Publication';
import { Validator } from '../../model/Validator';
import { BlockchainService, IPFSHash, IPNSHash, TransactionResult } from '../persistence/blockchain.service';
import { PersistenceService } from '../persistence/persistence.service';
import { IpnsResolutionService } from '../resolution/ipns-resolution.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private static INDEX_FILENAME = '.pulp.json';
  private static RESERVED_NAMES = ['.textileseed'];
  private static ROOT = '/';

  constructor(
    private persistenceService: PersistenceService,
    private blockchainService: BlockchainService,
    private ipnsResolutionService: IpnsResolutionService
  ) {}

  public async createPublication(
    publication: Publication
  ): Promise<{ publication: Publication; ipns_address: IPNSHash; transaction: TransactionResult }> {
    Validator.throwIfInvalid(publication, PublicationValidator);

    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);
    const links = await this.persistenceService.writeData(
      `${publication.slug}/${PublicationService.INDEX_FILENAME}`,
      publication
    );
    console.debug('links: ', links);

    const ipns_address = new IPNSHash(links.ipns.replace('https://hub.textile.io/', ''));

    const transaction = await this.blockchainService.createPublication(publication.slug, ipns_address);

    return {
      transaction,
      publication,
      ipns_address,
    };
  }

  public async createArticle(publication_slug: string, article: Article): Promise<LinksReply.AsObject> {
    Validator.throwIfInvalid(article, ArticleValidator);
    console.debug(
      `publishing article ${article.slug}; ${article.content.title}; subtitle length ${article.content.subtitle?.length}; content length ${article.content.body.length}`
    );
    const links = await this.persistenceService.writeData(`${publication_slug}/${article.slug}`, article);
    console.debug('links: ', links);

    const transaction = await this.blockchainService.publishArticle(publication_slug, new IPFSHash());

    const ipns_addr = new IPNSHash(links.ipns.replace('https://hub.textile.io/', ''));
    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(ipns_addr);

    // update publication with new transaction ID and article slug
    await this.addArticleToPublicationIndex(publication_slug, article, transaction.hash, ipfs_hash);

    return links;
  }

  public async getPublication(publication_slug: string): Promise<Publication> {
    console.debug(`fetching ${publication_slug}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    const publication = await this.persistenceService.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash.value}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
    );

    Validator.throwIfInvalid(publication, PublicationValidator);
    return publication;
  }

  public async listPublications(): Promise<string[]> {
    console.debug(`listing publications...`);
    const pathReply = await this.persistenceService.lsIpns(PublicationService.ROOT);
    if (!pathReply.item) {
      throw new Error(`The root publication path does not exist or is not visible`);
    }
    return pathReply.item.itemsList
      .filter((i) => PublicationService.RESERVED_NAMES.every((r) => i.name !== r))
      .map((p) => p.name);
  }

  public async listArticles(publication_slug: string): Promise<Publication> {
    console.debug(`listing articles from: ${publication_slug}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    return this.persistenceService.catIpfsJson<Publication>(
      `/ipfs/${ipfs_hash.value}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
    );
  }

  public async getArticle(publication_slug: string, article_index: string): Promise<Article> {
    console.debug(`fetching article: pnlp/${publication_slug}/${article_index}...`);
    const article = await this.persistenceService.catPathJson<Article>(`${publication_slug}/${article_index}`);

    if (!article) {
      throw new Error(`Article pnlp/${publication_slug}/${article_index} does not exist or is not visible`);
    }

    Validator.throwIfInvalid(article, ArticleValidator);
    return article;
  }

  private async addArticleToPublicationIndex(
    publication_slug: string,
    article: Article,
    transactionHash: string,
    ipfs_hash: IPFSHash
  ) {
    const publication = await this.getPublication(publication_slug);
    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transactionHash,
      title: article.content.title,
      ipfs_address: ipfs_hash.value,
      timestamp: article.timestamp,
    };

    await this.persistenceService.writeData(`${publication.slug}/${PublicationService.INDEX_FILENAME}`, publication);
  }
}
