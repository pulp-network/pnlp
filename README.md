# pnlp

Permissionless Publishing Platform

pnlp (pronounced "pulp") is an open publishing platform for written content.

# Development

- clone this repo
- cd `pnlp/pnlp-app`
- `npm install`
- `npm start`
- [http://localhost:4200](http://localhost:4200)

# Stack/Roadmap

### Proposed v1 (MVP targeted for HackFS)

- javascript browser application; candidates: React, Angular
- the browser application is deployed to and hosted on IPFS using Fleek
- browser application uses the ethers library to interact with the ethereum blockchain
- the browser application integrates with metamask to allow an "author" to sign an ethereum transaction (which includes a Submission's ipfs address) with their private wallet keys
- the browser application integrates with an IPFS gateway to allow the app to publish a Submission to IPFS; candidates: 3Box, Textile, Filecoin account?
- submissions are formatted as RSS-compliant files to enable all RSS clients out of the box
- readers can donate to a specific post to contribute to the author and/or to keep the content itself persisted

### Proposed v2 Roadmap

- make it easy for authors to associate ethereum addresses with a "friendly name" using ENS; display ENS name in webapp
- index submissions in some decentralized database. more research needed.
- add support for "private" submissions; published as encrypted files; "paid subscribers" can use metamask to send tokens in return for access to keys
- build simple RSS client (as a centralized service) that polls the pnlp.network and sends posts as emails to subscribers
- add support for multi-file submissions (ie submissions that contain images)

### Proposed v3 Roadmap

- See [pnlp.md](https://github.com/pnlp-network/pnlp/blob/master/pnlp.md)
