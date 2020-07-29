# A Semiformal Definition for the pulp protocol

pulp is a protocol that specifies a path for the regular publication and subscription of text-first content.

## Defintions

_The Characters whom pulp protocol serves and the Artifacts with which it deals._

### The Characters

There are three characters involved in pulp: the Author, the Subscriber, and the Aggregator.

The Author is a content creator. This is an individual who thinks she has something interesting to say on a regular basis and is brave enough to shout it out to the rest of the universe. The Author's primary medium is written, which is why she chose pulp: pulp is designed to facilitate text-first publications. Importantly, it is not a protocol intended for video-first, image-first, or audio-first publications. The Author is also not a website designer: she is interested in writing prose, not code or markup. Back in the day she published on Medium.com, then switched to Substack a year ago. But she fears lock-in, doesn't agree with certain platform policies, and is generally excited about web3. When pulp launched, she jumped at the chance to use a truly decentralized publishing platform.

The Subscriber is a content consumer. This is an individual who enjoys regular text-first content in a convenient form. The Subscriber is someone who puts his trust in particular Authors for the recurring content they provide. The Subscriber is also willing to compensate the parties that serve him the content conveniently because he recognizes that the convenience of and the recurrence of the content is as valuable as the content itself. The Subscriber is using pulp largely because his favorite Authors are writing on pulp.

The Aggregator is a party that serves both the Author and the Subscriber. It is a company or organization that provides a software client that implements the pulp protocol. The Aggregator is profit-driven, and designs the software client to serve the Author and the Subscriber in a way that maximizes profit. But Aggregators beware: it is a low-margin proposition. A good Aggregator recognizes the needs of the Author: marketing, subscriber tracking, a clean writing experience; the needs of the Subscriber: convenient content delivery; and the needs that overlap: content discovery. Importantly, the Aggregator is optional. A Subscriber may always seek out an Author directly and vice versa. The Aggregator is only as useful to this flow as it makes itself: by the nature of the pulp protocol, this middle party is optional.

The above actors take part in a dance around the pulp protocol that ultimately benefits all parties involved.

### The Artifacts

There are four artifacts: the Publication, the Article, the ArchivedArticle, and the Draft.

The Publication represents a channel for recurring text-first content. The pulp Publication is the magazine or the newsletter of web3. Each Publication is owned by an Author; it is the owning Author who writes the stream of written content emanating from the Publication. The owning Author of a Publication can also delegate publishing permsissions to other Authors should they so choose.

The Article represents a discrete unit of written content. Upon the release of the Article, the Aggregator collects the content and makes it available to the Subscriber in the convenient format that the Subscriber signed up for. Alternatively, the Subscriber may seek out the Article by visiting its unique content-based address through any browser of their choosing. At the option of the Author, an Article may be considered private and made available only to paying Subscribers; this is accomplished by publishing the encrypted version of the Article and distributing keys to paying Subscribers.

The ArchivedArticle represents a momentary and immutable snapshot of an Article as it existed at a point in time. Its persistence is funded by any and all parties who wish to preserve it for posterity. The ArchivedArticle includes metadata about the article such as Author, Publication, publicaiton date, etc. It is stored in an utterly distributed manner on the Filecoin network: once archived, no organization on Earth is powerful enough to censor its existence.

The Draft represents an unpublished Article. The Draft is stored in the same manner as any Article, but it is kept secret to the Author through encryption with the Author's own private keys. At any time, the Author may choose to release a Draft to the world by decrypting it and labeling it an Article.

## Technical Overview

An Author is identified on the pulp protocol by a public/private keypair. This keypair controls a corresponding Ethereum address for payments and ENS identification, it controls an IPNS address for publishing content, and it is used to encrypt and decrypt private Articles and Drafts.

A Subscriber is identified on the pulp protocol by a Public/Private Keypair and optionally an email address. Importantly, Subscribers of public content can remain completely anonymous.

A Publication is an IPNS address and a globally unique friendly name. A Publication is referred to by its multi-address: `pulp/<ipns-address>/<publication-name>`. The global uniqueness of the friendly name is enforced by the pulp publication registration contract on the Ethereum blockchain.

An Article is a file stored on the filecoin network. It is referred to by its multi-address: `pulp/<ipns-address>/<publication-name>/<article-name>`. Because it is nested under an IPNS address, an article is liable to be edited by the person who controls the keys to the IPNS address, its original Author.

An ArchivedArticle is a point-in-time snapshot of an Article that is stored on the Filecoin network. It is referred to by its ipfs hash: `ipfs/Qm....` For this reason it is immutable, even by the Author. Any Author, Aggregator, Subscriber, or even non-participant may decide to _archive_ an Article as an ArchivedArticle on the Filecoin network. This captures the Article and article metadata (like publication date, publication-name, author address) and persists it for some time at the expense of the archiving party.

## Protocol Outline

The protocol is based around 5 procedures:

- Register Publication
- Publish Article
- Read Article
- Archive Article
- Subscribe to Publication

#### Register Publication

_Prereqs:_

- the author has decided on a publication slug (`publication_slug`) to identify their Publication.
- the author has a public/private keypair to identify themselves according to the protocol.

**1. Generate IPNS Address**

Generate the IPNS address (`ipns_addr`) that corresponds with the public/private keypair that the Author controls.

**2a. Optional: Check to make sure publication slug is not already taken**

Make a call to the following ethereum pulp contract (off-chain) method.

```ts
resolvePublication(publication_slug) => ipns_addr;
```

This off-chain method retrieves the mapped `ipns_addr` given the `publication_slug`. Make sure this call returns no existing `ipns_addr`. This step will potentially save wasted gas on the next step.

**2. Register publication slug**

Make a call to the ethereum pulp contract method.

```ts
registerPublication(ipns_addr, publication_slug);
```

This maps a globally unique `publication_slug` to the author's `ipns_addr`. It will fail if the `publication_slug` is already reserved.

**3. Write directory to IPFS and update IPNS**

Write a directory to IPFS with the name of the publication slug; add a single metadata file called `.pulp.json`. Update the IPNS root to nest this IPFS directory one level deep such that the file will be retrievable at `ipns/<ipns_addr>/<publication_slug>/.pulp.json`. The contents of the file should be of the following form:

```json
{
  "slug": "<publication_slug> // same as parent directory name; globally unique through ethereum contract",
  "metadata": {
    "friendly_name": "Friendly Name of Publication",
    "tagline": "Some tagline for the publication"
  },
  "article_proofs": {}
}
```

#### Publish Article

_Prereqs_:

- the author has already registered a Publication
- the author has decided on an article slug (`arcticle_slug`) to identify the article and has composed some blog content that they want to publish

**1. Write Article to IPFS and update IPNS**
Write a new file to the publication directory with `article_slug` as the name. The `article_slug` must be unique to the publication (not globally unique). Repoint the root IPNS address to the new resulting IPFS address such that the file is retrievable at `ipns/<ipns_addr>/<publication_slug>/<article_slug>`. The contents of the file should be of the following form:

```json
{
  "slug": "<article_slug>",
  "author": "eth address of the author",
  "content": {
    "title": "Friendly title of article",
    "subtitle": "Some subtitle of article",
    "body": "Full article body..."
  }
}
```

Hang on to the resulting IPFS address (`ipfs_address`) of the article for the next step.

**2. Register proof of article existence in ethereum contract**

Make a call to the following ethereum pulp contract method:

```ts
publishArticle(ipfs_addr);
```

This records the `ipfs_address` of the article in an ethereum transaction to serve as a proof-of-existence at the time of the given transaction. It also serves as an "endorsement" of the article by the ethereum address holder, the Author.

**3. Record transaction in publication metadata file**

Update the `.pulp.json` file at the root of the publication directory to include the transaction in which the file was published. This serves as an indexed back-reference to the transaction for convenient inspection later. This should be of the form `article-slug : ethTransactionHash`

```json
{
  "slug": "<publication_slug>",
  "metadata": {
    "friendly_name": "Friendly Name of Publication",
    "tagline": "Some tagline for the publication"
  },
  "article_proofs": {
    "<article_slug>": "0xf0..."
  }
}
```

Again, update the IPNS record to point to the subsequently new IPFS directory.

#### Read Article

_Prereqs_:

- the reader knows the slug of the publication
- the reader optionally knows the slug of the article they want to read

**1. Resolve publication slug to IPNS address**

Make a call to the following ethereum pulp contract (off-chain) method with the publication slug.

```ts
resolvePublication(publication_slug) => ipns_addr
```

This off-chain method retrieves the mapped IPNS address given a publication slug.

**2. Optional: List Articles from Publication**

If the reader already knows which Article they want to read (i.e. they were sent a link directly to the article) they can skip this step.

Download this file: `ipns/<ipns_address>/<publication_slug>/.pulp.json`. This file contains a list of the article slugs published by the author.

Choose the article slug that you'd like to read.

**3. Download article from IPFS**

Download this file: `ipns/<ipns_address>/<publication_slug>/<article-slug>`. Enjoy!
