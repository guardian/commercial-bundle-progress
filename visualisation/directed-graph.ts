import { create, Selection } from "https://cdn.skypack.dev/d3-selection@3?dts";
import { transition } from "https://cdn.skypack.dev/d3-transition@3.0.1?dts";
import { schemeCategory10 } from "https://cdn.skypack.dev/d3-scale-chromatic@3?dts";
import { scaleOrdinal } from "https://cdn.skypack.dev/d3-scale@4?dts";
import { Data, Link, Node, xOrigin, yOrigin } from "./data.ts";
import { dragging, updateSimulationData } from "./simulation.ts";
import { Simulation } from "https://cdn.skypack.dev/-/d3-force@v3.0.0-cshj62qMoyIGNIXoil9u/dist=es2020,mode=types/index";

/** ********************
 *      Constants     *
 * ******************** */

const [width, height] = [1200, 600];

const svg = create("svg").attr("viewBox", [0, 0, width, height].join(" "));

const scale = scaleOrdinal(schemeCategory10);

const isNode = (n: string | Node): n is Node => typeof n !== "string";

const linkGroup = svg.append("g")
  .attr("class", "links")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6);

const nodeGroup = svg.append("g")
  .attr("class", "nodes");

const t = transition().duration(1200);

const updateSvgData = (data: Data, simulation: Simulation<Node, Link>) => {
  const { links, nodes } = data;

  const link = linkGroup
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (l) => l.value ?? null);

  const node = nodeGroup
    .selectAll("g")
    .data(nodes)
    .join(
      (enter) => {
        const newNode = enter.append("g")
          .attr("fill", "purple")
          .call((n) =>
            // @ts-expect-error -- issue with types https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16176
            n.transition().duration(600)
              .attr("fill", (d: Node) => scale(String(d.group)))
          )
          .attr(
            "data-imports",
            (d) => d.imports,
          )
          .attr(
            "data-origin",
            (d) => `${xOrigin(d.imports)},${yOrigin(d.imports)}`,
          );

        newNode
          .append("circle")
          .attr("stroke", "#fff")
          .attr("stroke-width", (d) => d.imports > 1 ? 1 : 0.25)
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", (d) => Math.sqrt(d.imports + 1) * 3);

        newNode.append("title")
          .text((d) => d.id);

        newNode
          .append("text")
          .text((d) => {
            if (d.id.includes("node_modules")) {
              return d.id.replace(
                /^.+node_modules\/((@(guardian|types)\/)?.+?)(\/.+)/g,
                "$1",
              );
            }
            return d.id.split("/").slice(-1)[0];
          })
          .attr("pointer-events", "none")
          .attr("font-size", 9)
          .attr("x", (d) => Math.sqrt(d.imports + 1) * 3 + 5)
          .attr("y", 3);
        return newNode;
      },
      (update) => {
        const updatedNodes = update;
        // .attr("fill", (d: Node) => scale(String(d.group)));

        return updatedNodes;
      },
      (exit) => exit.remove(),
    );

  node.exit().remove();
  link.exit().remove();

  // node.join((enter) => {
  //   console.log(enter);
  //   return enter;
  // }).append("path").attr("d", "M1 H1");

  node.on("mouseover", (_, n) => {
    link
      .attr("stroke-width", (l) => {
        return n === l.source ? 1.2 : n === l.target ? 1 : 0;
      })
      .style("stroke-dasharray", (l) => {
        return n === l.target ? "5 3" : null;
      });

    node.style("opacity", (d) => {
      const linked = links
        .filter((l) => l.source === n || l.target === n)
        .some((l) => l.source === d || l.target === d);
      return d === n || linked ? 1 : 0.06;
    });
  });

  node.on("mouseout", () => {
    link
      .attr("stroke-width", (l) => l.value ?? null)
      .style(
        "stroke-dasharray",
        null,
      );
    node.style("opacity", null);
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (l) => (isNode(l.source) && l.source.x) ?? 0)
      .attr("y1", (l) => (isNode(l.source) && l.source.y) ?? 0)
      .attr("x2", (l) => (isNode(l.target) && l.target.x) ?? 0)
      .attr("y2", (l) => (isNode(l.target) && l.target.y) ?? 0);

    node
      // .data(d => (d.fx = d.group * 30))
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  });
};

export { height, svg, updateSvgData, width };
