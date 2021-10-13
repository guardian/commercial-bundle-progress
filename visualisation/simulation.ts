// deno-lint-ignore-file no-explicit-any

import type { ForceLink, Simulation } from "./d3.ts";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "./d3.ts";
import type { DragBehavior } from "./d3.ts";
import { drag } from "./d3.ts";
import type { Data, Link, Node } from "./data.ts";
import { xOrigin, yOrigin } from "./data.ts";
import { radius } from "./directed-graph.ts";

const simulation = forceSimulation<Node, Link>()
  .force(
    "link",
    forceLink<Node, Link>()
      .id((n) => n.id)
      .strength(0),
  )
  // .force("charge", forceManyBody<Node>())
  .force(
    "collide",
    forceCollide<Node>((d) => radius(d) + 6),
  )
  // .force("center", forceCenter(width / 2, height / 2))
  .force(
    "x",
    forceX<Node>()
      .x((n: Node) => xOrigin(n.folder)),
    // .strength(0.3),
  )
  .force(
    "y",
    forceY<Node>()
      .y((n) => yOrigin(n.imports)),
    // .strength(0.15),
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
  simulation.alpha(0.3).restart();

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
