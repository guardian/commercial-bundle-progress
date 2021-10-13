const branch = "mxdvl/universal-commercial-bundle";
const tree: Record<string, string[]> = await fetch(
  `https://raw.githubusercontent.com/guardian/frontend/${branch}/tools/__tasks__/commercial/graph/output/commercial.standalone.ts.json`,
).then((r) => r.json());

type Link = {
  source: string;
  target: string;
  value?: number;
};
type Node = {
  id: string;
  group?: number;
};

type Data = {
  nodes: Node[];
  links: Link[];
};

enum Groups {
  Entry,
  Typescript,
  Javascript,
  Tests,
}

const nodes = Object.keys(tree).map((id) => {
  const group = id.includes("commercial.")
    ? Groups.Entry
    : id.includes(".ts")
    ? Groups.Typescript
    : Groups.Javascript;
  return ({ id, group });
});

const links = Object.entries(tree).reduce(
  (links: Link[], branch) => {
    const [source, targets] = branch;

    targets.forEach((target) => {
      links.push({ source, target });
    });

    return links;
  },
  [],
);

export const data: Data = { nodes, links };

console.log(data);
// await Deno.writeTextFile("file-tree.json", JSON.stringify(data, null, " "));
