import type { Progress } from "../progress.ts";
import { axisLeft, line, scaleLinear, scaleTime } from "./d3.ts";

// https://stackoverflow.com/a/61829368
const dir = new URL(".", import.meta.url).pathname;

const data: Progress[] = JSON.parse(
  Deno.readTextFileSync(dir + "/../progress.json"),
);

const _max = <T extends number | Date>(array: T[]): T =>
  array.reduce((curr, prev) => curr > prev ? curr : prev);

const _min = <T extends number | Date>(array: T[]): T =>
  array.reduce((curr, prev) => curr < prev ? curr : prev);

const RANGE = [0, 300];

const yScale = scaleLinear()
  .domain([
    0,
    1,
    // min(data.map((d) => d.percentage)), // or 0
    // max(data.map((d) => d.percentage)), // or 1
  ])
  .range(RANGE);

const xScale = scaleTime()
  .domain([
    new Date(2021, 0, 1),
    new Date(),
  ])
  .range([0, 600]);

const linePath = line<Progress>()
  .x((d) => xScale(Date.parse(d.date)))
  .y((d) => yScale(d.percentage));

console.log(linePath);

// deno run --no-check --allow-read visualisation/line-graph.ts

/*




  */
// Example from https://observablehq.com/@jeantimex/how-to-draw-a-basic-line-chart

var x = scaleLinear()
  .domain([10, 130])
  .range([0, 960]);

xScale(20); // 80
xScale(50); // 320

// https://www.skypack.dev/view/d3-axis
// https://www.skypack.dev/view/d3-scale
