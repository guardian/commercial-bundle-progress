import * as Colours from "https://deno.land/std@0.102.0/fmt/colors.ts";
import { getTree } from "./visualisation/data.ts";
// import { expandGlob } from "https://deno.land/std@0.102.0/fs/mod.ts";

const repo = "https://api.github.com/repos/guardian/frontend";
// "/contents/static/src/javascripts/projects/commercial

console.log("Using repo:", Colours.bold(repo));

const dir = "/contents/static/src/javascripts";

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
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

type File = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: number;
  url: string;
};

type CommitData = {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
};

type Tree = {
  sha: string;
  author: string;
  date: string;
  files: File[];
};

const listRepo = async (url: string): Promise<File[]> => {
  try {
    const files: File[] = [];
    const rootFiles: {
      sha: string;
      url: string;
      tree: File[];
    } = await fetch(url).then((r) => r.json());

    for await (const file of rootFiles.tree) {
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

const getInitialTree = async (ref?: string) => {
  const url = ref ? repo + dir + "?ref=" + ref : repo + dir;
  const blobs: Blob[] = await fetch(url)
    .then((r) => r.json());

  return blobs.filter((blob) => blob.type === "dir");
};

const getFiles = async (ref?: string): Promise<Tree> => {
  const initialTree = await getInitialTree(ref);
  console.log("Using tree:", initialTree);

  const bundleFiles = Object.keys(await getTree(ref ?? "main"))
    .map((path) =>
      path.startsWith("../") ? path.substring(2) : "bootstraps/" + path
    );
  const files: File[] = [];
  for (const tree of initialTree) {
    const extraFiles = await listRepo(tree.git_url + "?recursive=true");

    console.log({ extraFiles, bundleFiles });

    const filteredFiles = extraFiles.map((file) => {
      return {
        ...file,
        path: "/" + tree.name + "/" + file.path,
      };
    }).filter((file) => bundleFiles.includes(file.path));

    files.push(...filteredFiles);
  }

  console.log(files);

  if (ref) {
    const path = `${Deno.cwd()}/trees/${ref}.json`;

    const localData = await Deno.readTextFile(path).catch(() => null);

    if (localData) {
      console.log("Using local data:", path);
      const localTree: Tree = JSON.parse(localData);
      return localTree;
    }

    const data: CommitData = await fetch(`${repo}/commits/${ref}`).then((r) =>
      r.json()
    );

    const tree: Tree = {
      sha: data.sha,
      author: data.commit.author.name,
      date: data.commit.author.date,
      files,
    };

    Deno.writeTextFile(path, JSON.stringify(tree));

    return tree;
  }

  return {
    date: "now",
    author: "unknown",
    sha: "main",
    files,
  };
};

const tree: Tree = await getFiles(Deno.args[0]);

console.log("\n");
console.log(Colours.bold("File list:"));
tree.files.map((file) => {
  if (!file.path.includes(".spec.")) {
    const extension = file.path.includes(".ts") ? "ts" : "js";
    const color = extension === "ts" ? Colours.green : Colours.yellow;
    files[extension] = files[extension] + 1;
    const numLines = file.size;
    sizes[extension] = sizes[extension] + numLines;
    console.log(color(file.path));
  } else {
    console.log(Colours.dim(file.path));
  }
});

console.log("\n");
console.log(Colours.bold("Summary info:"));
console.log("Total file count", files);
console.log("Total file sizes", sizes);

// https://github.com/guardian/frontend/search?o=desc&p=1&q=merge%3Atrue&s=committer-date&type=Commits

export { getFiles };
export type { File, Tree };
