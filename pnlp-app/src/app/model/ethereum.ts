export type EthereumAddress = string;

export type AuthorAddress = EthereumAddress;
export type SubscriberAddress = EthereumAddress;
export type EditorialAddress = EthereumAddress;
export type EnsName = string;
export type EthereumTransaction = string;

export type TransactionResult = {
  hash: string;
  // TODO:TX_RESULT fill out type (or import from ethers if they have one?)
};

export type IpnsHash = string;
export type IpfsHash = string;
