import {
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "https://cdn.skypack.dev/d3-force@3?dts";
import { height, updateSvgData, width } from "./directed-graph.ts";
import { updateSimulationData } from "./simulation.ts";

const repo = "guardian/frontend";
const branch = "main";
const path =
  "tools/__tasks__/commercial/graph/output/standalone.commercial.ts.json";
const url = (sha = branch) =>
  `https://raw.githubusercontent.com/${repo}/${sha}/${path}`;
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
  Packages,
}

const folders = [
  "node_modules",
  "../lib",
  "projects/commercial",
  "projects/common",
];

const xOrigin = (folder: number) =>
  width * (folder / (folders.length + 1)) + width / 6;

let maximum = 0;
const yOrigin = (size: number, max = maximum) =>
  Math.round(
    height * (
      0.18 + 0.54 *
        (1 - size / max)
    ),
  );

const clean = (s: string): string => s.replace(/(\.d)?\.(j|t)s$/, "");

const _range = (arr: number[]) =>
  arr.reduce<[number, number]>((prev, curr) => {
    const [low, high] = prev;
    return [Math.min(low, curr), Math.max(high, curr)];
  }, [arr[0], arr[0]]);

const getDataforHash = async (sha = branch) => {
  const graph = await fetch(url(sha));
  const tree: Record<string, string[]> = await graph.json();

  const maxImports = Object.entries(tree).reduce<number>((max, value) => {
    const [_, links] = value;
    return Math.max(max, links.length);
  }, 0);
  maximum = maxImports;

  // Add node modules
  Object.entries(tree).forEach((value) => {
    const [, links] = value;
    links.forEach((link) => {
      if (link.includes("node_modules")) {
        tree[clean(link)] = [];
      }
    });
  });

  const nodes: Node[] = Object.entries(tree).map<Node>((value) => {
    const [id, links] = value;
    const group: Groups = id.includes("commercial.")
      ? Groups.Entry
      : id.includes("node_modules")
      ? Groups.Packages
      : id.includes(".ts")
      ? Groups.Typescript
      : Groups.Javascript;

    const folder = folders.reduce((prev, current, index) => {
      return id.includes(current) ? index : prev;
    }, 0);

    const imports = links.length;

    const node: Node = {
      id: clean(id),
      group,
      folder,
      imports,
    };

    return node;
  }).map((node, i) => {
    node.x = xOrigin(node.folder) + Math.random() * 10 + i % 10;
    node.y = yOrigin(node.imports, maxImports) - Math.random() * 10 + i % 10;
    return node;
  });
  // .concat(packages);

  const links: Link[] = Object.entries(tree).reduce((links: Link[], branch) => {
    const [source, targets] = branch;

    const newLinks: Link[] = targets.map((target) => ({
      source: clean(source),
      target: clean(target),
      value: targets.length > 0 ? 0.5 : 0.25,
    }));

    return [...links, ...newLinks];
  }, []);

  return { nodes, links };
};

setTimeout(async () => {
  // const newNodes: Node[] = Array(10).fill(null).map((_, i) => ({
  //   id: "something-" + i,
  //   group: Groups.Entry,
  //   folder: 2,
  //   imports: 9,
  // }));

  // const newLinks: Link[] = Array(10).fill(null).map((_, i) => ({
  //   source: clean("standalone.commercial.ts"),
  //   target: "something-" + i,
  // }));

  // nodes.push(...newNodes);
  // links.push(...newLinks);

  const data = await getDataforHash("287ac0a948594e2f95d0fe0e5791d6dce959456c");

  // nodes.splice(30, 60);

  updateSimulationData(data);
  updateSvgData(data, simulation);
}, 3600);

const data = await getDataforHash();
const simulation = updateSimulationData(data);

updateSvgData(data, simulation);

export { folders, getDataforHash, xOrigin, yOrigin };
export type { Data, Link, Node };
