import type { Progress } from "../progress.ts";
import { curveBundle, line } from "../d3/shape.ts";
// import { axisBottom, axisLeft } from "../d3/axis.ts";
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
const width = 900;
const height = 400;

const now = new Date();

const yScale = scaleLinear()
  .domain([0, 1])
  .range([height - 20, 0]); // note direction of y-axis in SVG

const xScale = scaleTime()
  .domain([
    new Date(now.getFullYear() - 1, now.getMonth(), 21),
    new Date(now.getFullYear(), now.getMonth() + 1, 5),
  ])
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
    ).curve(curveBundle)(data)
  }" />`;

const xAxis = (): string => {
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const many = Array<undefined>(13).fill(undefined);

  const ticks = many.map((_, index) => {
    const then = new Date(now.getUTCFullYear(), now.getUTCMonth() - index, 5);
    const month = months[then.getUTCMonth()];
    const year = month === "Jan"
      ? " ’" + then.getUTCFullYear().toString().slice(-2)
      : "";
    return `<g transform="translate(${Math.round(xScale(then))}, 0)">
      <text text-anchor="middle"
      fill="black"
      stroke="none"
      transform="translate(0, 12)">${month}${year}</text>
      <path d="M0,0 v-5" />
    </g>`;
  });
  return `
  <path d="M0,0 h${width}" />
  ${ticks.join("")}
  `;
};

const yAxis = (sections: number): string => {
  const marks = Array(sections - 1).fill(yScale.domain()[1])
    .map((max, count) => {
      const y = yScale((count + 1) * max / sections);
      return `<path d="M 0,${Math.round(y)} h${width}" />`;
    });

  return marks.join("");
};

/**
 * The SVG as string, which we’ll save to a file.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${width} ${height}"
  width="${width}"
  height="${height}">
  <style>
    text {
      font-family: \"Courier New\", Courier, monospace;
      font-size: 12px;
    }
  </style>
  <g class="lines" fill="none">
    ${path("percentage", { stroke: "darkblue" })}
    ${path("percentageSize", { stroke: "blue" })}
    
    ${path("percentage", { stroke: "darkorange", typed: false })}
    ${path("percentageSize", { stroke: "orange", typed: false })}
  </g>
  
  <g class="axis y" stroke="black" fill="none" stroke-dasharray="4 6">
    ${yAxis(4)}
  </g>
  <g
    class="axis x"
    stroke="black" fill="none"
    transform="translate(0, ${height - 20})">
  ${xAxis()}
  </g>
</svg>`;

Deno.writeTextFileSync(dir + "../public/build/progress.svg", svg);

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
