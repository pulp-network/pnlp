# pnlp
Permissionless Publishing Platform

pnlp (pronounced "pulp") is an open publishing platform for written content.

### For authors

Write and publish on the open web. Assemble a following and earn money from your readership.

Your authorship stands alone without editorial oversight, restrictive platform policies, or government censorship.

### For subscribers

Browse the best writing on the open web. Support the authors you value most. Subscribe for convenience.

# Stack/Roadmap

### Proposed v1 (MVP targeted for HackFS)

* javascript browser application; candidates: React, Angular
* the browser application is deployed to and hosted on IPFS using Fleek
* the browser application integrates with metamask to allow an "author" to sign an ethereum transaction (which includes a Submission's ipfs address) with their private wallet keys
* the browser application integrates with an IPFS gateway to allow the app to publish a Submission to IPFS; candidates: 3Box, Textile?
* submissions are formatted as RSS-compliant files to enable all RSS clients out of the box

### Proposed v2 Roadmap

* make it easy for authors to associate ethereum addresses with a "friendly name" using ENS; display ENS name in webapp
* index submissions in some decentralized database. more research needed.
* add support for "private" submissions; published as encrypted files; "paid subscribers" can use metamask to send tokens in return for access to keys
* build simple RSS client (as a centralized service) that polls the pnlp.network and sends posts as emails to subscribers
* add support for multi-file submissions (ie submissions that contain images)

### Proposed v3 Roadmap

* See [pnlp.md](https://github.com/pnlp-network/pnlp/blob/master/pnlp.md)

# Project Principles

* Keep it focused. The most common pitfall in the blockchain space is the problem of over-generalization. We love building protocols and therefore we are inclined to generalize. But in building _applications_ we must avoid the urge to generalize and remain focused on the niche.
* User experience comes first. The other common pitfall in the blockchain space (by the nature of its infancy) is that applications require a tangle of addresses, signatures, and contract data to interact. But we believe we've come far enough such that a user operating on web3 should hardly even have to know they're interacting with the blockchain unless they're interested in the space. In 2020, a web3 app should look like any other webapp.
* we all have full time jobs and lives outside of this. be respectful of other contributors and be respectful of their time.
