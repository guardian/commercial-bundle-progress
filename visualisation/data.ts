import {
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "https://cdn.skypack.dev/d3-force@3?dts";
import { height, width } from "./directed-graph.ts";

interface Link extends SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value?: number;
}
interface Node extends SimulationNodeDatum {
  id: string;
  group: number;
  folder: number;
  imports: number;
}

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

const folders = ["lib", "projects/commercial", "projects/common"];

const tree: Record<string, string[]> = await fetch(
  "https://raw.githubusercontent.com/guardian/frontend/mxdvl/universal-commercial-bundle/tools/__tasks__/commercial/graph/output/commercial.standalone.ts.json",
).then((r) => r.json());

const xOrigin = (folder: number) =>
  width * (folder / (folders.length + 1)) + width / 6;
const yOrigin = (size: number) =>
  Math.round(
    height * (
      0.18 + 0.54 *
        (1 - size / maxImports)
    ),
  );

const _range = (arr: number[]) =>
  arr.reduce<[number, number]>((prev, curr) => {
    const [low, high] = prev;
    return [Math.min(low, curr), Math.max(high, curr)];
  }, [arr[0], arr[0]]);

const maxImports = Object.entries(tree).reduce<number>((max, value) => {
  const [_, links] = value;
  return Math.max(max, links.length);
}, 0);

const nodes: Node[] = Object.entries(tree).map<Node>((value) => {
  const [id, links] = value;
  const group = id.includes("commercial.")
    ? Groups.Entry
    : id.includes(".ts")
    ? Groups.Typescript
    : Groups.Javascript;

  const folder = folders.reduce((prev, current, index) => {
    return id.includes(current) ? index : prev;
  }, 0);

  const imports = links.length;

  const node: Node = {
    id,
    group,
    folder,
    imports,
  };

  return node;
}).map((node) => {
  node.x = xOrigin(node.folder);
  node.y = yOrigin(node.imports);
  return node;
});

const links: Link[] = Object.entries(tree).reduce((links: Link[], branch) => {
  const [source, targets] = branch;

  const newLinks: Link[] = targets.map((target) => ({
    source,
    target,
    value: targets.length > 0 ? 0.5 : 0.25,
  }));

  return [...links, ...newLinks];
}, []);

const data: Data = { links, nodes };

export { data, folders, xOrigin, yOrigin };
export type { Data, Link, Node };
