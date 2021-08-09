import { create } from "https://cdn.skypack.dev/d3-selection@3?dts";
import { schemeCategory10 } from "https://cdn.skypack.dev/d3-scale-chromatic@3?dts";
import { scaleOrdinal } from "https://cdn.skypack.dev/d3-scale@4?dts";
import { data, xOrigin, yOrigin } from "./data.ts";
import { dragging, simulation } from "./simulation.ts";

/**********************
 *      Constants     *
 **********************/

const [width, height] = [1200, 600];

const { links, nodes } = data;
const svg = create("svg").attr("viewBox", [0, 0, width, height].join(" "));

const scale = scaleOrdinal(schemeCategory10);

const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", (l) => l.value ?? null);

const node = svg
  .append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("fill", (d) => scale(String(d.group)))
  .attr("data-imports", (d) => d.imports)
  .attr("data-origin", (d) => `${xOrigin(d.imports)},${yOrigin(d.imports)}`)
  .call(dragging(simulation));

node
  .append("circle")
  .attr("stroke", "#fff")
  .attr("stroke-width", (d) => d.imports > 1 ? 1 : 0.25)
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", (d) => Math.sqrt(d.imports + 1) * 3);

node.append("title")
  .text((d) => d.id);

node
  .append("text")
  .text((d) => d.id.split("/").slice(-1)[0])
  .attr("pointer-events", "none")
  .attr("font-size", 9)
  .attr("x", (d) => Math.sqrt(d.imports + 1) * 3 + 5)
  .attr("y", 3);

node.on("mouseover", (_, n) => {
  console.log(link);
  link
    .attr("stroke-width", (l) => {
      return n === l.source ? 1 : n === l.target ? 0.25 : 0;
    })
    .style("stroke-dasharray", (l) => {
      return n === l.target ? 2 : null;
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
    .attr("x1", (l) => l.source.x)
    .attr("y1", (l) => l.source.y)
    .attr("x2", (l) => l.target.x)
    .attr("y2", (l) => l.target.y);

  node
    // .data(d => (d.fx = d.group * 30))
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
});

export { height, svg, width };
