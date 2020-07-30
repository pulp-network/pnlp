import { Injectable } from '@angular/core';
import { LinksReply, ListPathItem } from '@textile/buckets-grpc/buckets_pb';
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
  ): Promise<{ publication: Publication; links: LinksReply.AsObject; transaction: TransactionResult }> {
    Validator.throwIfInvalid(publication, PublicationValidator);

    console.debug(`creating a new publication: ${JSON.stringify(publication)}`);
    const links = await this.persistenceService.writeData(
      `${publication.slug}/${PublicationService.INDEX_FILENAME}`,
      publication
    );
    console.debug('links: ', links);

    const ipns_addr = links.ipns.replace('https://hub.textile.io/', '');

    const transaction = await this.blockchainService.createPublication(publication.slug, new IPNSHash(ipns_addr));

    return {
      transaction,
      publication,
      links,
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

    // update publication with new transaction ID and article slug
    await this.addArticleToPublicationIndex(publication_slug, article, transaction.hash);

    return links;
  }

  public async getPublication(publication_slug: string): Promise<Publication> {
    console.debug(`fetching ${publication_slug}...`);

    const publication_record = await this.blockchainService.getPublication(publication_slug);

    // TODO: for dp-kb testing purposes, we can remove this when ERROR_1 is fixed
    // const publication_record = {
    //   ipns_hash: new IPNSHash('bafzbeiceh6wcfjlwn5fhny7s7o63velb2vbcekskejrc36a4fhegnof7py')
    // }

    const ipfs_hash = await this.ipnsResolutionService.resolveIpns(publication_record.ipns_hash);

    const publication = await this.persistenceService.catIpfsJson<Publication>(
      `${ipfs_hash.value}/${publication_slug}/${PublicationService.INDEX_FILENAME}`
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

  public async listArticles(
    publication_slug: string
  ): Promise<{ publication: Publication; article_refs: ListPathItem.AsObject[] }> {
    console.debug(`listing articles from: ${publication_slug}...`);
    const pathReply = await this.persistenceService.lsIpns(`${publication_slug}`).catch((err) => {
      throw new Error(`We looked high and low for ${publication_slug} but we can't find it right now`);
    });

    if (!pathReply.item) {
      throw new Error(`We looked high and low for ${publication_slug} but we can't find it right now`);
    }

    const index = pathReply.item.itemsList.find((i) => i.name === PublicationService.INDEX_FILENAME);
    const publication = await this.readIndex(index.path);
    const article_refs = pathReply.item.itemsList.filter((i) => i.name !== PublicationService.INDEX_FILENAME);

    return {
      publication,
      article_refs,
    };
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

  private async addArticleToPublicationIndex(publication_slug: string, article: Article, transactionHash: string) {
    const publication = await this.getPublication(publication_slug);
    publication.articles = publication.articles || {};
    publication.articles[article.slug] = {
      tx: transactionHash,
      title: article.content.title,
      timestamp: article.timestamp,
    };

    await this.persistenceService.writeData(`${publication.slug}/${PublicationService.INDEX_FILENAME}`, publication);
  }

  private async readIndex(ipfs_address: string) {
    try {
      if (!ipfs_address) {
        throw new Error('Index path does not exist');
      }
      console.debug('Reading index file at: ', ipfs_address);
      const publication = await this.persistenceService.catIpfsJson<Publication>(ipfs_address);
      Validator.throwIfInvalid(publication, PublicationValidator);
      return publication;
    } catch (err) {
      throw new Error('The given directory is not a valid pnlp publication. ' + err);
    }
  }
}
