export interface Publication {
  subdomain: string; //TODO:11:can we use ENS to register? // does Textile hub guarantee uniqueness?
  metadata: {
    name: string;
    description: string;
  };
}

export const ValidPublicationSubdomain = /^[a-z0-9]+$/;

export const PublicationValidator = (publication: Publication): string => {
  let err = '';
  let delimiter = '';
  if (!publication.subdomain) {
    err += delimiter + 'subdomain';
    delimiter = ', ';
  }
  if (!publication.metadata) {
    err += delimiter + 'metadata';
    delimiter = ', ';
  } else {
    if (!publication.metadata.name) {
      err += delimiter + 'metadata.name';
      delimiter = ', ';
    }
    // validate other required fields under metadata...
  }
  if (err) {
    return 'Publication missing required fields: ' + err;
  } else {
    return '';
  }
};
