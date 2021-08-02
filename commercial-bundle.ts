import * as Colours from "https://deno.land/std@0.102.0/fmt/colors.ts";
// import { expandGlob } from "https://deno.land/std@0.102.0/fs/mod.ts";

const repo = "https://api.github.com/repos/guardian/frontend";
// "/contents/static/src/javascripts/projects/commercial

console.log("Using repo:", Colours.bold(repo));

const dir = "/contents/static/src/javascripts/projects";

const files = {
  ts: 0,
  js: 0,
};

const sizes = {
  ts: 0,
  js: 0,
};

type Blob = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  "html_url": string;
  "git_url": string;
  "download_url": string;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export type File = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: number;
  url: string;
};

type Tree = {
  sha: string;
  url: string;
  tree: Array<File>;
};

const listRepo = async (
  url: string,
): Promise<File[]> => {
  try {
    const files: File[] = [];
    const rootFiles = await fetch(url)
      .then((r) => r.json()) as Tree;

    for await (
      const file of rootFiles.tree
    ) {
      if (file.type === "blob") files.push(file);
      // if (file.type === "tree") await listRepo(file.url);
    }

    return files;
  } catch (e) {
    console.log(url);
    console.log(e);
    return [];
  }
};

const getFiles = async (ref?: string): Promise<File[]> => {
  if (ref) {
    const path = `${Deno.cwd()}/trees/${ref}.json`;

    const localData = await Deno.readTextFile(path).catch(() => null);

    if (localData) {
      console.log("Using local data:", path);
      return JSON.parse(localData);
    }

    const initialTree = (await fetch(
      repo + dir + "?ref=" + ref,
    ).then((r) => r.json()) as Blob[]).filter((e) => e.name === "commercial");

    console.log("Using tree:", initialTree);

    const fileTree = await listRepo(
      initialTree[0].git_url +
        "?recursive=true",
    );

    Deno.writeTextFile(
      path,
      JSON.stringify(fileTree),
    );

    return fileTree;
  } else {
    const initialTree = (await fetch(
      repo + dir,
    ).then((r) => r.json()) as Blob[]).filter((e) => e.name === "commercial");

    console.log("Using tree:", initialTree);

    return listRepo(
      initialTree[0].git_url +
        "?recursive=true",
    );
  }
};

const projectFiles: File[] = await getFiles(Deno.args[0]);

console.log("\n");
console.log(Colours.bold("File list:"));
projectFiles.map((file) => {
  if (!file.path.includes(".spec.")) {
    const extension = file.path.includes(".ts") ? "ts" : "js";
    const color = extension === "ts" ? Colours.green : Colours.yellow;
    files[extension] = files[extension] + 1;
    const numLines = file.size;
    sizes[extension] = sizes[extension] + numLines;
    console.log(color(file.path));
  } else {
    console.log(
      Colours.dim(file.path),
    );
  }
});

console.log("\n");
console.log(Colours.bold("Summary info:"));
console.log("Total file count", files);
console.log("Total file sizes", sizes);

// https://github.com/guardian/frontend/search?o=desc&p=1&q=merge%3Atrue&s=committer-date&type=Commits

export { getFiles };
