# TODO

**TODO:RETURN_TYPES: IPNS/IPFS**

- we should use the strong types across the codebase for ipns and ipfs

## **TODO:AWAIT_TRANSACTION**

**TODO:ETH_CONTRACTS**

- we'll need to deploy eth contracts to some testnet and then the mainnet
- ropsten today
- mainnet weekend

**TODO:SIGN_IN**dp-kb

- hide "create publication" page and "create article" page until user has identified themselves with metamask
- allow components to easily grab current eth address from identity service

## Small/Random

- TODO:TX_RESULT: add proper typing for transaction result
- TODO:SVGS: consolidate svgs
- TODO:PRISM: fix code highlighting in markdown: see "Prism not found" error in browser on pageload
- TODO:HELP_LINKS: add help links to markdown spec, emoji spec, etc https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
- rename article-list page to publication-home page
- TODO:ADD_IPFS: add article ipfs address on article creation in .pulp.json

## Burner

- add ENS aliases to ETH addresses

* alpha flow: ask for email, but use developer key in background
  - stub auth0 key request and return developer key
* beta flow: ask for email list in auth0
  - auth0 can simply be a script that signs and returns requests after checking email list
