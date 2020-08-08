# TODO

** TODO:Serve from IPFS Gateway **

- right now if the app is served out of an IPFS gateway, all requests are relative to the root domain
- ie: https://cloudflare-ipfs.com/ipfs/Qmc4T34pTKgSWB9Qwsr9MMphvcfw9trcKK4aZhkP6uFjPS
- looks for css files here: https://cloudflare-ipfs.com/*.css
- this doesn't work, they should be relative to /index.html
- to fix this, I _think_ we need to play around with the `base` element in `index.html`

**TODO:Publication Branded Top Bar**

- add color preference to metadata
- add logo preference to metadata
- add publication-state.service
- grab publication and transaction from url. if it exists:

if transaction and complete, redirect to transactionless URL.
if transaction and incomplete, set status=PENDING and await transaction
on success, set status=ACTIVE and route to transactionless URL
on fail, set status=FAILED and route to failed article URL

```
{
   publication : Publication;
   publication_status: PENDING | ACTIVE | FAILED;
   transaction: TxHash;
}
```

- add article-state.service
- grab current article and transaction from url. if it exists:

```
{
   article : Article;
   article_status: PENDING | ACTIVE | FAILED;
   transaction: TxHash;
}
```

if transaction and complete, redirect to transactionless URL
if transaction and incomplete, set status=PENDING and await transactions
on success, set status=ACTIVE and route to transactionless URL
on fail, set status=FAILED and route to failed article URL

**TODO:AWAIT_TRANSACTION**dimetradon

- we need an await transaction method on the blockchain service

**TODO:SUBDOMAINS**dp-kb

- move publication slug to subdomain ie `<slug>.on.pnlp.network` instead of `pnlp.network/pnlp/<slug>`

**TODO:SIGN_IN**dp-kb

- sign in page
- hide "create publication" page and "create article" page until user has identified themselves with metamask
- sign in should observe redirect url

**TODO:DO NOT REQUIRE SIGN IN ON ARTICLE LIST**

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
- // TODO:convert to findFriendlyName (return alias OR address)

## Burner

- add ENS aliases to ETH addresses

* alpha flow: ask for email, but use developer key in background
  - stub auth0 key request and return developer key
* beta flow: ask for email list in auth0
  - auth0 can simply be a script that signs and returns requests after checking email list
