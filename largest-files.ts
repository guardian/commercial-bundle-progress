import type { File, Tree } from "./commercial-bundle.ts";

const sha = "25a4079b3b5170b45d0525499171aee092eab773";

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
