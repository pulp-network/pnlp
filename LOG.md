### 2020-07-06

- created repo
- decided on core architectural elements
- outlined basic product vision in README

### 2020-07-07

- cloned ngx-rocket/starter-kit to bootstrap Angular application
- removed all unnecessary cruft
- added basic application layout
- added content filler to homepage
- created mockups for login flow

### 2020-07-08

- added build image for fleek
- configured fleek deployment to pnlp.network

### 2020-07-09

- organized Github projects and issues
- created mockups for login flow
- added architecture diagrams for v0.0.1

### 2020-07-10

- did research on dynamic persistence options for the article content
- looked at Fleek, Textile, 3Box
- noticed some starter videos and rich docs from Textile team so landed on using Textile Buckets
- after playing around briefly with running our own ipfs gateway, decided v0.0.1 should use Textile Hub
- added textile dependencies and watched: https://www.youtube.com/watch?v=IZ8M9m9_uJY and followed https://gist.github.com/carsonfarmer/e7062ab30ddd4eb55812d64890db20d3 to figure out interface

### 2020-07-11

- Aimed to get e2e persistence and retrieval working with textile buckets with insecure test key
- added `editor` component
- achieved basic object persistence in bucket
- figured out getLinks to retrieve ipns address through textile hub urls

### 2020-07-12

- added `new-publication` component
- tried wrapping mind around coupling pnlp subdomains with ipfs addresses
- realized we're going to want to use ipns addresses instead
- added list pages for publication list and article list
- trying to figure out how to map publication name to ipns address and keep publication names unique

### 2020-07-13

- publication editor
- added bootstrap styling to create-publication, list-article
- added ngx-markdown-editor

### 2020-07-14

- added bootstrap styling to new-article
- added bootstrap styling to article-read
- added ngx-markdown
