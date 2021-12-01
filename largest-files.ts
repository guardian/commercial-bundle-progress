import type { File, Tree } from "./commercial-bundle.ts";
import type { Progress } from "./progress.ts";

const dir = new URL(".", import.meta.url).pathname;

const progress: Progress[] = JSON.parse(
  Deno.readTextFileSync(
    dir + "/progress.json",
  ),
);

const sha = progress[0].sha;

const tree: Tree = JSON.parse(
  Deno.readTextFileSync(`./trees/${sha}.json`),
);

const { files } = tree;

const jsFiles = files
  .filter((file) => file.path.endsWith(".js"))
  .sort((file, otherFile) => otherFile.size - file.size)
  .slice(0, 12)
  .map((file) => [file.size, file.path]);

console.log(jsFiles);

Deno.writeTextFileSync(
  dir + "/public/build/largest-files.json",
  JSON.stringify(jsFiles),
);
