#!/bin/bash

top_dir="$(dirname $(dirname $(realpath $0)) )"

echo "running in dir: $top_dir";

mkdir "$top_dir/public/build";

deno --version;
deno bundle "$top_dir/visualisation/index.ts" \
    "$top_dir/public/build/bundle.js" \
    --config="$top_dir/visualisation/tsconfig.json";

deno run --allow-read --allow-write visualisation/line-graph.ts

deno run --allow-read --allow-write largest-files.ts