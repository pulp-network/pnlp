export declare type HashType = 'SHA1' | 'SHA256' | 'SHA512';
export declare type CurveType = 'P-256' | 'P-384' | 'P-521';
export declare type CipherType = 'AES-128' | 'AES-256' | 'Blowfish';

export interface PublicKey {
  /**
   * A protobuf serialized representation of this key.
   */
  readonly bytes: Uint8Array;
  /**
   * Verify the signature of the given message data.
   * @param data The data whose signature is to be verified.
   * @param sig The signature to verify.
   */
  verify(data: Uint8Array, sig: Uint8Array): Promise<boolean>;
  /**
   * Return the raw bytes of this key. Not to be conused with `bytes`.
   */
  marshal(): Uint8Array;
  /**
   * Test for equality with another key.
   * @param key Other key.
   */
  equals(key: PublicKey): boolean;
  /**
   * Compute the sha256 hash of the key's `bytes`.
   */
  hash(): Promise<Uint8Array>;
}

/**
 * Generic private key interface.
 */
export interface PrivateKey {
  /**
   * The public key associated with this private key.
   */
  readonly public: PublicKey;
  /**
   * A protobuf serialized representation of this key.
   */
  readonly bytes: Uint8Array;
  /**
   * Generates a digital signature on the given data.
   * @param data The data to sign.
   */
  sign(data: Uint8Array): Promise<Uint8Array>;
  /**
   * Return the raw bytes of this key. Not to be conused with `bytes`.
   */
  marshal(): Uint8Array;
  /**
   * Test for equality with another key.
   * @param key Other key.
   */
  equals(key: PrivateKey): boolean;
  /**
   * Compute the sha256 hash of the key's `bytes`.
   */
  hash(): Promise<Uint8Array>;
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  id(): Promise<string>;
}
export declare function publicKeyToString(key: PublicKey): string;
export declare function privateKeyToString(key: PrivateKey): string;
export declare function privateKeyFromString(str: string): Promise<PrivateKey>;
export interface Public {
  verify(data: Uint8Array, sig: Uint8Array): Promise<boolean>;
  toString(): string;
  bytes: Uint8Array;
}
/**
 * Identity represents an entity capable of signing a message.
 * This is a simple 'private key' interface that must be capable of returning the associated public key for
 * verification. In many cases, this will just be a private key, but callers can use any setup that suits their needs.
 * The interface is currently modeled after @textile/threads-crypto PrivateKeys.
 */
export interface Identity {
  sign(data: Uint8Array): Promise<Uint8Array>;
  public: Public;
}
export declare class Libp2pCryptoPublicKey implements Public {
  key: PublicKey;
  constructor(key: PublicKey);
  /**
   * Verify the given signed data.
   * @param data The data to verify.
   * @param sig The signature to verify.
   */
  verify(data: Uint8Array, sig: Uint8Array): Promise<boolean>;
  /**
   * Returns base32 encoded Public key representation.
   */
  toString(): string;
  /**
   * The raw bytes of the Public key.
   */
  get bytes(): Uint8Array;
}
export declare class Libp2pCryptoIdentity implements Identity {
  key: PrivateKey;
  constructor(key: PrivateKey);
  /**
   * Signs the given data with the Private key,
   * @param data Data to be signed.
   */
  sign(data: Uint8Array): Promise<Uint8Array>;
  /**
   * Returns the Public key.
   */
  get public(): Libp2pCryptoPublicKey;
  /**
   * Create a random Ed25519 Identity.
   */
  static fromRandom(): Promise<Libp2pCryptoIdentity>;
  /**
   * Returns base32 encoded private key representation.
   */
  toString(): string;
  /**
   * Creates key key from base32 encoded string representation
   * @param str
   */
  static fromString(str: string): Promise<Libp2pCryptoIdentity>;
}
