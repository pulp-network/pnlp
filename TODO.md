# TODO

**TODO:RETURN_TYPES: IPNS/IPFS**

- we should use the strong types across the codebase for ipns and ipfs

**TODO:ETH_CONTRACTS**

- we'll need to deploy eth contracts to some testnet and then the mainnet

**TODO:CONTRACT_JSON**

we need to deploy the contract.json along with the rest of the angular app (fleek is doing this every time we commit to master in our github account); options:

1. we configure fleek to run truffle build as part of the fleek deployment
1. we build the contract.json once on local and commit it to source code

either way, the output will have to be somewhere inside the angular app for the angular build to pick it up and put it in pnlp-app/dist which is the directory fleek is deploying. maybe we output the contract.json next to the blockchain.service ?

**TODO:SIGN_IN**

- hide "create publication" page and "create article" page until user has identified themselves with metamask
- allow components to easily grab current eth address from identity service

## Small/Random

- TODO:TX_RESULT: add proper typing for transaction result
- TODO:SVGS: consolidate svgs
- TODO:PRISM: fix code highlighting in markdown: see "Prism not found" error in browser on pageload
- TODO:HELP_LINKS: add help links to markdown spec, emoji spec, etc https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
- TODO:ADD_IPFS: add article ipfs address on article creation in .pulp.json

## Burner

- add ENS aliases to ETH addresses

* alpha flow: ask for email, but use developer key in background
  - stub auth0 key request and return developer key
* beta flow: ask for email list in auth0
  - auth0 can simply be a script that signs and returns requests after checking email list
