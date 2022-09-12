# Commercial Bundle Visualisation

This folder contains the files which are used to build the graphs shown here:
https://guardian.github.io/commercial-bundle-progress/index.html

## Local development

You need `Deno`, which can be installed via `brew install deno`.

```bash
deno bundle index.js public/build/bundle.js --config=tsconfig.json --watch
```

## Running the graph page

Install deno file_server, using the following command:

```bash
deno install --allow-net --allow-read https://deno.land/std@0.155.0/http/file_server.ts
```

To build the bundle, run this command inside the repository folder:

```bash
scripts/build.sh
```

Then use file_server to build the bundle locally:

```bash
~/.deno/bin/file_server public
```

This will give you a localhost address, which you can visit to see the node and
line graphs.
