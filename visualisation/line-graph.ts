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
 * @param path a string for the d="" attribute
 * @param stroke colour of the stroke
 */
const path = (path: string | null, stroke = "black") =>
  path ? `<path stroke="${stroke}" d="${path}" />` : "";

/**
 * The SVG as string, which we’ll save to a file.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width} ${height}"
  width="${width}"
  height="${height}">
  <g class="lines" fill="none">
    ${
  path(
    line<Progress>(
      (d) => xScale(Date.parse(d.date)),
      (d) => yScale(1 - d.percentage),
    )(data),
    "orange",
  )
}
    ${
  path(
    line<Progress>(
      (d) => xScale(Date.parse(d.date)),
      (d) => yScale(1 - d.percentageSize),
    )(data),
    "darkorange",
  )
}



    ${
  path(
    line<Progress>(
      (d) => xScale(Date.parse(d.date)),
      (d) => yScale(d.percentage),
    )(data),
    "darkblue",
  )
}
    ${
  path(
    line<Progress>(
      (d) => xScale(Date.parse(d.date)),
      (d) => yScale(d.percentageSize),
    )(data),
    "blue",
  )
}
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
