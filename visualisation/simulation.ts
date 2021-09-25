// deno-lint-ignore-file no-explicit-any
import {
  // forceCenter,
  forceCollide,
  ForceLink,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  Simulation,
} from "https://cdn.skypack.dev/d3-force@3?dts";
import { drag, DragBehavior } from "https://cdn.skypack.dev/d3-drag@3?dts";
import { Data, Link, Node, xOrigin, yOrigin } from "./data.ts";
// import { height, width } from "./directed-graph.js";

const simulation = forceSimulation<Node, Link>()
  .force(
    "link",
    forceLink<Node, Link>()
      .id((n) => n.id)
      .strength(0),
  )
  .force("charge", forceManyBody<Node>())
  .force(
    "collide",
    forceCollide((n: Node) => Math.sqrt(Math.max(n.imports, 1)) * 4),
  )
  // .force("center", forceCenter(width / 2, height / 2))
  .force(
    "x",
    forceX<Node>().x((n: Node) => xOrigin(n.folder)),
  )
  .force(
    "y",
    forceY<Node>()
      .y((n) => yOrigin(n.imports))
      .strength(0.15),
  );

const updateSimulationData = (data: Data) => {
  const { nodes, links } = data;

  const oldNodes = simulation.nodes();

  // keep old current location if it exists
  oldNodes.forEach((oldNode) => {
    const newNode = nodes.find((n) => n.id == oldNode.id);
    if (!newNode) return;
    newNode.x = oldNode.x;
    newNode.y = oldNode.y;

    oldNode.group !== newNode.group
      ? newNode.converted = true
      : newNode.converted = false;
  });

  simulation.nodes(nodes);
  simulation.force<ForceLink<Node, Link>>("link")?.links(links);
  simulation.alpha(0.8).restart();

  return simulation;
};

const dragging = (
  simulation: Simulation<any, Link>,
): DragBehavior<any, Node, unknown> => {
  const dragStarted = (event: any) => {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };

  const dragged = (event: any) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragEnded = (event: any) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return drag<any, Node>()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
};

export { dragging, updateSimulationData };
