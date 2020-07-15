TODO:

- consolidate svgs
- fix code highlighting in markdown
- add help links to markdown spec, emoji spec, etc https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md

Auth:

- alpha flow: ask for email, but use developer key in background
  - stub auth0 key request and return developer key
- beta flow: ask for email list in auth0
  - auth0 can simply be a script that signs and returns requests after checking email list
