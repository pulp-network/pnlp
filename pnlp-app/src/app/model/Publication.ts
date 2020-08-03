export interface Publication {
  slug: string;
  editor: string;
  founded: Date;
  name: string;
  description: string;
  articles: {
    [article_slug: string]: ArticleSummary;
  };
}

export interface ArticleSummary {
  tx: string;
  ipfs_address: string;
  title: string;
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
