#!/bin/bash

echo "Updating local data for $1";

deno run -A commercial-bundle.ts $1
deno fmt ./trees

deno run -A progress.ts
deno fmt progress.json

deno run --allow-read --allow-write visualisation/line-graph.ts