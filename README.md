# pnlp

A First Implementation of the Permissionless Publishing Protocol

pnlp is a decentralized application that serves as the reference implementation of the pulp protocol. pnlp lets authors publish content and manage subscribers in an author-centric manner.

# About

[10,000 foot view](https://github.com/pnlp-network/pnlp/blob/master/SLIDES.md)

[Work in Progress Whitepaper](https://github.com/pnlp-network/pnlp/blob/master/WHITEPAPER.md)

[Project Principles](https://github.com/pnlp-network/pnlp/blob/master/PRINCIPLES.md)

# Development
_Instructions for contributing to this repository_

- clone this repo
- cd `pnlp/pnlp-app`
- `npm install`
- `npm start`
- Visit [http://localhost:4200](http://localhost:4200)

By default, the local app will connect to our ropsten network contract (specified in `environment.ts`). If you would like to instead connect to a local testnet, use the following steps in a new shell session

- `npm install -g ganache-cli`
- Run `ganache-cli`
- Run `cd pnlp-contract && truffle build && truffle migrate`
- Copy the deployed contract address into `environment.ts`, you may need to bounce the app

#### Brief Stack Overview

- javascript browser application; Angular
- the browser application is deployed to and hosted on IPFS using Fleek
- browser application uses the ethers.js library to interact with Metamask and the ethereum blockchain
- we use metamask to serve as the Author's "identity"
- the browser application integrates with an IPFS gateway to allow the app to publish an Article to IPFS using Textile Buckets

# Development/Product Guidelines

- We all have full time jobs and lives outside of this. Be respectful of other contributors and be respectful of their time.
- Be constructive in your feedback and interactions, not destructive or aggressive.
- Keep the product focused. The most common pitfall in the blockchain space is the problem of over-generalization. We love building protocols and therefore we are inclined to generalize. But in building _application protocols_ we must avoid the urge to generalize and remain focused on the niche. This means answering "no" to scope creap: "it would be cool if... authors could stream video; authors could chat with subscribers; authors could post podcasts; etc."
- User experience is paramount. Another common pitfall in the blockchain space--by the nature of its infancy--is that applications require a tangle of addresses, signatures, and contract data to interact. But we believe we've come far enough such that a user operating on web3 should hardly even have to know they're interacting with the blockchain unless they're interested in the space. In 2020, a web3 app should look like any other webapp
