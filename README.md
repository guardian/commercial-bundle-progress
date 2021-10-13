# Commercial Bundle Progress

This is very much a manual process that tracks the progress of converting the
commercial bundle to Typescript. You can see the [result here][result here] for
the content of the `commercial` project. This excludes libs and other
dependencies in `common`.

[result here]: https://flatgithub.com/mxdvl/commercial-bundle-progress?filename=progress.json&sha=7415c7bac675bf3b696c677c6af486761363d24c

## Add commit URLS

Where `{hash}` is the hash of the merge commit, generate the tree.

```bash
deno run -A commercial-bundle.ts {hash}
```

## Update progress report in `commercial` project

Make sure you add the commit hashes above with a specific date.

```bash
deno run -A progress.ts
```

This will update `progress.json` accordingly.
