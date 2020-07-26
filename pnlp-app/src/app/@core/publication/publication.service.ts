import { Injectable } from '@angular/core';
import { LinksReply, ListPathItem } from '@textile/buckets-grpc/buckets_pb';
import { Article, ArticleValidator } from '../../model/Article';
import { Publication, PublicationValidator } from '../../model/Publication';
import { Validator } from '../../model/Validator';
import { PersistenceService } from '../persistence/persistence.service';
import { BlockchainService } from '../persistence/blockchain.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private static INDEX_FILENAME = 'index.json';
  private static RESERVED_NAMES = ['.textileseed'];
  private static ROOT = '/';

  constructor(private persistenceService: PersistenceService) {}

  public async createPublication(
    publication: Publication
  ): Promise<{ publication: Publication; links: LinksReply.AsObject }> {
    Validator.throwIfInvalid(publication, PublicationValidator);

    console.debug(`creating a new publication: ${JSON.stringify(publication.metadata)}; at ${publication.subdomain}`);
    const links = await this.persistenceService.writeData(
      `${publication.subdomain}/${PublicationService.INDEX_FILENAME}`,
      publication
    );

    // TODO:DIMETREDON
    // (1) ng g service blockchain
    // (2) using ethers, create transaction invoking contract
    // (3) ask metamask to sign it
    // (4) broadcast transaction using infura, metamask, ...

    return {
      publication,
      links,
    };
  }

  public async createArticle(publication_subdomain: string, article: Article): Promise<LinksReply.AsObject> {
    Validator.throwIfInvalid(article, ArticleValidator);
    console.debug(
      `publishing article: ${article.content.title}; ${article.content.subtitle}; content length ${article.content.body.length}`
    );
    return this.persistenceService.writeData(`${publication_subdomain}/${article.index}`, article);
  }

  public async getPublication(publication_subdomain: string): Promise<Publication> {
    console.debug(`fetching ${publication_subdomain}...`);

    // TODO:DIMETREDON
    // (1) using infura, metamask, ...
    // (2) call getPublication(publication_subdomain)

    const publication = await this.persistenceService.catPathJson<Publication>(
      `${publication_subdomain}/${PublicationService.INDEX_FILENAME}`
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
    publication_subdomain: string
  ): Promise<{ publication: Publication; article_refs: ListPathItem.AsObject[] }> {
    console.debug(`listing articles from: ${publication_subdomain}...`);
    const pathReply = await this.persistenceService.lsIpns(`${publication_subdomain}`).catch((err) => {
      throw new Error(`We looked high and low for ${publication_subdomain} but we can't find it right now`);
    });

    if (!pathReply.item) {
      throw new Error(`We looked high and low for ${publication_subdomain} but we can't find it right now`);
    }

    const index = pathReply.item.itemsList.find((i) => i.name === PublicationService.INDEX_FILENAME);
    const publication = await this.readIndex(index.path);
    const article_refs = pathReply.item.itemsList.filter((i) => i.name !== PublicationService.INDEX_FILENAME);

    return {
      publication,
      article_refs,
    };
  }

  public async getArticle(publication_subdomain: string, article_index: string): Promise<Article> {
    console.debug(`fetching article: pnlp/${publication_subdomain}/${article_index}...`);
    const article = await this.persistenceService.catPathJson<Article>(`${publication_subdomain}/${article_index}`);

    if (!article) {
      throw new Error(`Article pnlp/${publication_subdomain}/${article_index} does not exist or is not visible`);
    }

    Validator.throwIfInvalid(article, ArticleValidator);
    return article;
  }

  private async readIndex(ipfs_address: string) {
    try {
      if (!ipfs_address) {
        throw new Error('Index path does not exist');
      }
      const publication = await this.persistenceService.catIpfsJson<Publication>(ipfs_address);
      Validator.throwIfInvalid(publication, PublicationValidator);
      return publication;
    } catch (err) {
      throw new Error('The given directory is not a valid pnlp publication. ' + err);
    }
  }
}
