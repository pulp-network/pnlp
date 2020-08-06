# pnlp.network

The Permissionless Publishing Platform

pnlp.network facilitates the publication and subscription of text-first blog content. pnlp.network is a decentralized application:

- the app itself is hosted on IPFS
- the app adheres to the pulp protocol: an abstraction on top of ethereum, ipfs, ipns, ens, and filecoin that is itself an open protocol
- through the protocol, the app facilitates a censor-proof means of text-based blog/newsletter authorship and subscribership

The ability to publish simple text-content for all to see is a human right. It is also a human right to anonymously or pseudonymously subscribe to said content. pnlp.network is the manifestation of these principles; it is the mathematical inevitability that is an individual's freedom to express and consume ideas in written form.

[HackFS Log](https://github.com/pnlp-network/pnlp/blob/master/LOG.md)

## pulp protocol

pulp is a protocol for text-content publication and subscription; the protocol defines a set of behaviors useful to content authors, content subscribers, and content aggregators

pulp is an abstraction on top of already-decentralized technologies:

- pulp uses ethereum private keys as the foundation of identity; thus authors may identify themselves using ENS and sign transactions through native wallets
- pulp bridges ethereum identity to LibP2PIdentity; thus authors may alter IPNS records
- pulp publishes content to IPFS
- pulp updates IPNS records to point channel to content
- pulp uses ethereum contracts to namespace Publications (channels)
- pulp archives blog content using Filecoin at the request and payment of any user

[Whitepaper: WIP](https://github.com/pnlp-network/pnlp/blob/master/WHITEPAPER.md)

# Development

- clone this repo
- cd `pnlp/pnlp-app`
- `npm install`
- `npm install -g ganache-cli`

## To run the smart contracts against a local testnet

- Run `cd pnlp-contract && truffle build && truffle migrate`.
- Run `ganache-cli` in a new terminal.
- Copy the contract address into `blockchain.service.ts`

## To run on the public testnet

- Keep code as is. The address of the public contract is `0x88D632D0266CE47608FAE77ff4D37344FE562f12`.

## To run the frontend

- Open another terminal
- `cd ../pnlp-app && npm start`
- [http://localhost:4200](http://localhost:4200)
- during HackFS, use [FEEDBACK.md](https://github.com/pnlp-network/pnlp/blob/master/FEEDBACK.md) to list all (even minor) interactive trouble with positive and critical feedback for other teams we're interacting with. This is helpful to the community at large.
- use [LOG.md](https://github.com/pnlp-network/pnlp/blob/master/LOG.md) to make high level notes about new accomplishments/progress/challenges on any given day. We hope to be able to start blogging about the development of `pnlp` _on_ `pnlp` itself and LOG.md can serve as the bones of many articles.

### Stack Description

- javascript browser application; Angular
- the browser application is deployed to and hosted on IPFS using Fleek
- browser application uses the ethers library to interact with the ethereum blockchain
- the browser application integrates with metamask to allow an "author" to sign an ethereum transaction (which includes an Article's ipfs address) with their private wallet keys
- the browser application integrates with an IPFS gateway to allow the app to publish an Article to IPFS using Textile Buckets

# Iterations

##### `v0.0.1` Acceptance Criteria

[x] July 13-19; Demo Friday July 17
[x][milestone v0.0.1](https://github.com/pnlp-network/pnlp/milestone/1)
[x] user can use metamask as identity provider; [issue](https://github.com/pnlp-network/pnlp/issues/10)
[x] user can sign and publish post from simple text-area to ipns address [issue](https://github.com/pnlp-network/pnlp/issues/11)
[x] author can list their own publications; [issue](https://github.com/pnlp-network/pnlp/issues/21)
[x] author can navigate to each publication and list articles under that publication; [issue](https://github.com/pnlp-network/pnlp/issues/22)
[x] author can read their own article; [issue](https://github.com/pnlp-network/pnlp/issues/23)
[x] author can link a pnlp slug to an IPNS directory and persist this info in a decentralized way. How? TBD..... but the pnlp article address should be a multi-address: `pnlp/<pnlp-version>/<publication-name>/<article-name>` [issue](https://github.com/pnlp-network/pnlp/issues/24)

##### `v0.0.2` Acceptance Criteria

[X]July 20-26; Demo Friday, July 24
[X][milestone v0.0.2](https://github.com/pnlp-network/pnlp/milestone/2)
[x] user can write post from a markdown editor
[x] reader can navigate to a publication other than their own
[x] reader can list articles under publication
[x] reader can navigate to and read any article from list
[x] reader can see the ethereum address of the author
[x] reader can see the ipfs address of the article
[ ] author can edit/update an article (this may be a whole can of worms... and if so might be worth pushing off. however, we need to design this to not preclude this from happening)

##### `v0.0.3` Acceptance Criteria

[X] July 27-Aug 2; Demo July 31
[X][milestone v0.0.3](https://github.com/pnlp-network/pnlp/milestone/3)
[ ] user has access to simple, well-formed instructions to introduce different parts of the app; [issue](https://github.com/pnlp-network/pnlp/issues/14); [issue](https://github.com/pnlp-network/pnlp/issues/new)
[x] reader can donate ethereum to author; [issue](https://github.com/pnlp-network/pnlp/issues/14)
[ ] reader can donate Filecoin to the persistence of the article; [issue](https://github.com/pnlp-network/pnlp/issues/17)
[ ] reader can see the estimated duration for which the article is presently funded

#### `v0.0.4` Acceptance Criteria

[ ] July 3-Aug 4; Demo Aug 4
[ ][milestone v0.0.4](https://github.com/pnlp-network/pnlp/milestone/4)
[ ] user has at least two options for language in i18n dropdown (en-US, fr-FR?); [issue](https://github.com/pnlp-network/pnlp/issues/15)
[x] user has reasonably stylish experience navigating the app and writing content; [issue](https://github.com/pnlp-network/pnlp/issues/16)

#### Roadmap

- make it easy for authors to associate ethereum addresses with a "friendly name" using ENS; display ENS name in webapp
- index submissions in some decentralized database. more research needed. thegraph?
- add support for "private" submissions; published as encrypted files; "paid subscribers" can use metamask to send tokens in return for access to keys
- build simple RSS client (as a centralized service) that polls the pnlp.network and sends posts as emails to subscribers
- add support for multi-file submissions (ie submissions that contain images)
