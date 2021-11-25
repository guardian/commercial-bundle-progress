# Commercial Bundle Progress

This is very much a manual process that tracks the progress of converting the
commercial bundle to Typescript. You can see the [result here][result here] for
the content of the `commercial` project. This excludes libs and other
dependencies in `common`.

[result here]: https://flatgithub.com/mxdvl/commercial-bundle-progress?filename=progress.json&sha=7415c7bac675bf3b696c677c6af486761363d24c

## Current TypeScript conversion progress

![Progress graph](https://raw.githubusercontent.com/guardian/commercial-bundle-progress/gh-pages/build/progress.svg)

## Add commit URLS

Where `{hash}` is the hash of [the merge commit][frontend], generate the tree.

[frontend]: https://github.com/guardian/frontend/commits

```bash
./scripts/update.sh {hash}
```
