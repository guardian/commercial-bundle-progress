import type { Progress } from "../progress.ts";
import { axisLeft, domain, line, range, scaleLinear, scaleTime } from "./d3.ts";

const data: Progress[] = JSON.parse(Deno.readTextFileSync("../progress.json"));

const max = <T extends number | Date>(array: T[]): T =>
  arr.reduce((curr, prev) => curr > prev ? curr : prev);

const min = <T extends number | Date>(array: T[]): T =>
  arr.reduce((curr, prev) => curr < prev ? curr : prev);

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

const line = line().x((d: Progress) => xScale());

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
