import type { Progress } from "../progress.ts";
import { line } from "../d3/shape.ts";
import { scaleLinear, scaleTime } from "../d3/scale.ts";

// Remote data from JSON //
/**
 * Directory in which this file is found.
 * https://stackoverflow.com/a/61829368
 */
const dir = new URL(".", import.meta.url).pathname;

const data: Progress[] = JSON.parse(
  Deno.readTextFileSync(dir + "/../progress.json"),
);

// Dimensions //
const width = 600;
const height = 400;

const yScale = scaleLinear()
  .domain([0, 1])
  .range([height, 0]); // note direction of y-axis in SVG

const xScale = scaleTime()
  .domain([new Date(2021, 1, 1), new Date()])
  .range([0, width]);

// SVG methods //
/**
 * Helper method to generate line paths
 * @param key the Progress key to report on
 * @param options various options to generate the path
 */
const path = (
  key: keyof Pick<Progress, "percentage" | "percentageSize">,
  { typed = true, stroke = "black" },
) =>
  `<path stroke="${stroke}" d="${
    line<Progress>(
      (d) => xScale(Date.parse(d.date)),
      (d) => yScale(typed ? d[key] : 1 - d[key]),
    )(data)
  }" />`;

/**
 * The SVG as string, which we’ll save to a file.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width} ${height}"
  width="${width}"
  height="${height}">
  <g class="lines" fill="none">
    ${path("percentage", { stroke: "darkorange" })}
    ${path("percentageSize", { stroke: "orange" })}
    
    ${path("percentage", { stroke: "darkblue", typed: false })}
    ${path("percentageSize", { stroke: "blue", typed: false })}
  </g>
</svg>`;

Deno.writeTextFileSync(dir + "../public/progress.svg", svg);

// deno run --allow-read --allow-write visualisation/line-graph.ts

// Example from https://observablehq.com/@jeantimex/how-to-draw-a-basic-line-chart
// WIP -- unused

const _max = <T extends number | Date>(array: T[]): T =>
  array.reduce((curr, prev) => curr > prev ? curr : prev);

const _min = <T extends number | Date>(array: T[]): T =>
  array.reduce((curr, prev) => curr < prev ? curr : prev);

const _linePath = line<Progress>()
  .x((d) => xScale(Date.parse(d.date)))
  .y((d) => yScale(d.percentage));
