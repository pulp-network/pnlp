# TODO

**TODO:AWAIT_TRANSACTION**dimetradon

- we need an await transaction method on the blockchain service

**TODO:DEPLOY_CONTRACT_MAINNET**dimetradon

- we need to deploy the contract to the mainnet and
- when we do that, we'll want to update the following places: TODO:ROPSTEN-MAINNET

**TODO:SUBDOMAINS**dp-kb

- move publication slug to subdomain ie `<slug>.on.pnlp.network` instead of `pnlp.network/pnlp/<slug>`

**TODO:SIGN_IN**dp-kb

- sign in page
- hide "create publication" page and "create article" page until user has identified themselves with metamask
- sign in should observe redirect url

**TODO:PUBLICATION_AUTHOR**dimetradon

- to reproduce: create publication, navigate to "Start Writing ->"
- see below log:
- "found publication at bafzbeifq532yyyhyzvlanhvkgjnu2kq4rzkexmjdqcysqglrm2ubad4ob4 published by undefined on 1596477216"
- looks like the publication.author is coming back as undefined

## Small/Random

- TODO:TX_RESULT: add proper typing for transaction result
- TODO:SVGS: consolidate svgs
- TODO:HELP_LINKS: add help links to markdown spec, emoji spec, etc https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
- rename article-list page to publication-home page
- TODO:RETURN_TYPES: we should use the strong IPNS/IPFS types across the codebase for ipns and ipfs

## Burner

- add ENS aliases to ETH addresses

* alpha flow: ask for email, but use developer key in background
  - stub auth0 key request and return developer key
* beta flow: ask for email list in auth0
  - auth0 can simply be a script that signs and returns requests after checking email list
