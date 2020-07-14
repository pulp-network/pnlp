export interface Article {
  index: string;
  content: {
    title: string;
    subtitle?: string;
    body: string;
  };
}

export const ValidArticleIndex = /^[a-zA-Z0-9-_]+$/;

export const ArticleValidator = (article: Article): string => {
  let err = '';
  let delimiter = '';
  if (!article.index) {
    err += delimiter + 'index';
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
