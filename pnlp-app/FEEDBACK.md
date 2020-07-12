### _Collection of feedback for various teams we're interacting with_

**Fleek**

- configured July 8th
- overall great experience
- add an angular build image to defaults? (`trion/ng-cli` is a popular one, though notably it doesn't work out of the box because the default user doesn't have write access to `/`. I wrapped it in `pnlp/build-image` and switched users to root)
- container user needs to be able to write to / (largely obvious, but worth calling out. mine wasn't)
- make it clear that `Publish directory` is _relative to_ `Base directory` (again, largely obvious but something I missed initially)

**Textile**

- initial error message: `This module is declared with using 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.` Changing the flag as it said resolves it.
- Another error after adjusting the previous setting: `Module not found: Error: Can't resolve 'crypto' in micro-aes-gcm`. Created a github ticket for this: https://github.com/textileio/js-threads/issues/389
- CLI `hub buck` returning `Error!` without explanation. hard to find if that means I've not configured something I need to.
- docs are reasonably helpful. javascript docs and intellisense have been tremendously helpful.
