// deno-lint-ignore-file no-explicit-any -- it’s D3
import {
  // forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  Simulation,
} from "https://cdn.skypack.dev/d3-force@3?dts";
import { drag, DragBehavior } from "https://cdn.skypack.dev/d3-drag@3?dts";
import { data, Link, Node, xOrigin, yOrigin } from "./data.ts";
// import { height, width } from "./directed-graph.js";

const { links, nodes } = data;

const simulation = forceSimulation<Node, Link>(nodes)
  .force(
    "link",
    forceLink<Node, Link>(links)
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
      .y((n) => yOrigin(n.imports)),
    // .strength(0.15),
  );

simulation.nodes(nodes);

const dragging = (
  simulation: Simulation<any, Link>,
): DragBehavior<any, Node, unknown> => {
  function dragStarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragEnded(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return drag<any, Node>()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
};

export { dragging, simulation };
