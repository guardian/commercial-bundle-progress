#!/bin/bash

if [ $# -lt 1 ]; then
  echo 1>&2 "Missing commit hash!"
  echo "Get one from See https://github.com/guardian/frontend/commits"
  exit 2
fi

echo "Updating local data for $1";

deno run -A commercial-bundle.ts $1
deno fmt ./trees

deno run -A progress.ts
deno fmt progress.json