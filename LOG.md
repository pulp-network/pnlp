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
- tried wrapping mind around coupling pnlp slugs with ipfs addresses
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

### 2020-07-15

- add TODO comments and organize tasks
- stop initializing Textile bucket on every call
- add error and loader components to UI

### 2020-07-16

- begin draft of pulp whitepaper
- [continue exploring identity options](https://filecoinproject.slack.com/archives/C016LN9CZDH/p1594898788197400)
- need to get metamask to generate libp2pidentity for textile to use to create ipns record
- settled on using 3box for this task

### 2020-07-17

- add 3Box package to app to use for identity
- lots of errors; traced to problems in build configuration

### 2020-07-18

- add smart contracts to pnlp-contract
- add ganache and truffle framework for development
- add ethers.js to package.json
- opened

### 2020-07-19

- add [3box-angular-example](https://github.com/pnlp-network/3box-angular-example) repository to publish baseline Angular+3Box example

### 2020-07-20

- fix angular 3box loading problem, webpack configuration changes here: [3box-angular-example](https://github.com/pnlp-network/3box-angular-example)

### 2020-07-21

### 2020-07-22

### 2020-07-23

- ran into 3box [call issue](https://filecoinproject.slack.com/archives/C016WNAD649/p1595509083332200)

### 2020-07-24

### 2020-07-25

### 2020-07-26

- modify smart contracts
- add blockchain service
- add key-generation to generate LibP2PIdentity from Metamask private key

### 2020-07-27

### 2020-07-28

### 2020-07-29

-

### 2020-07-30

### 2020-07-31

### 2020-08-01

### 2020-08-02

### 2020-08-03

### 2020-08-04
