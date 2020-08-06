export interface Article {
  slug: string;
  timestamp: Date;
  author: string;
  edit_of?: string; // ipfs hash of parent (for which this represents a modification)
  retracted?: boolean;
  content: {
    title: string;
    subtitle?: string;
    body: string;
  };
}

export const ValidArticleSlug = /^[a-zA-Z0-9-_]+$/;

export const ArticleValidator = (article: Article): string => {
  let err = '';
  let delimiter = '';
  if (!article.slug) {
    err += delimiter + 'slug';
    delimiter = ', ';
  }
  if (!article.timestamp) {
    err += delimiter + 'timestamp';
    delimiter = ', ';
  }
  if (!article.author) {
    err += delimiter + 'author';
    delimiter = ', ';
  }
  if (!article.content) {
    err += delimiter + 'content';
    delimiter = ', ';
  } else {
    if (!article.content.title) {
      err += delimiter + 'content.title';
      delimiter = ', ';
    }
    if (!article.content.body) {
      err += delimiter + 'content.body';
      delimiter = ', ';
    }
  }
  if (err) {
    return 'Article missing required fields: ' + err;
  }
};
