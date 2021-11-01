import type { File, Tree } from "./commercial-bundle.ts";

const commitPrs: Record<string, number> = {
  "71d171f79144da76003f5d850de89083b0a3a3da": 24260,
  bcef4a9197c134a1e6a6b16a4e2d893af8f80f33: 24148,
  "062507eed21dc403be557b2e919f9a7ccfbe92c9": 24132,
  "6845baacb3ee9d46bce79ffb098f5f339f898a4d": 24106,
  "5a9ef6dc74572d5d901ec94247b3e01c727babdf": 24097,
  "47fda6f771a90e0b16d94c577ed20dba1b492b50": 24071,
  afce864c2599b824f8cdf88e7a22b6c4eb2bdd00: 24045,
  "1f46e8df8163d505ee03760ff2b45f819e4d6df2": 24044,
  "03c1e9fac0a6b3fd19ed017dd67e8ee7ae63b338": 24025,
  "19d404bcaf74091a7c5a40f0bd5a516fb847f1a1": 23946,
  "3b9703bebd50961b6b914f8989339e1bdcfe8936": 23863,
  af8b840b7f4108f7980603dd2dfa2174110f3a49: 23594,
};

export type Progress = {
  date: string;
  author?: string;
  prLink?: string;
  percentage: number;
  percentageSize: number;
  typed: number;
  typedSize: number;
  untyped: number;
  untypedSize: number;
  totalSize: number;
  sha: string;
};

const progressArray: Progress[] = [];
const path = "./trees";
for await (const file of Deno.readDir(path)) {
  const data: Tree | null = file.isFile
    ? JSON.parse(await Deno.readTextFile(path + "/" + file.name))
    : null;

  if (data) {
    const { sha, date, author } = data;

    const files = data.files.filter((f) => !f.path.includes(".spec."));
    const _tests = data.files.filter((f) => f.path.includes(".spec."));
    const typed = files.filter((f) => f.path.includes(".ts"));
    const untyped = files.filter((f) => f.path.includes(".js"));

    const sum = (p: number, c: File) => p + c.size;

    const percentage = typed.length / (typed.length + untyped.length);

    const typedSize = typed.reduce(sum, 0);
    const untypedSize = untyped.reduce(sum, 0);

    const progress: Progress = {
      date,
      author,
      sha,
      typed: typed.length,
      typedSize,
      untyped: untyped.length,
      untypedSize,
      percentage,
      percentageSize: typedSize / (typedSize + untypedSize),
      totalSize: typedSize + untypedSize,
    };

    if (commitPrs[sha]) {
      progress.prLink = "https://github.com/guardian/frontend/pull/" +
        commitPrs[sha];
    }

    progressArray.push(progress);
  }

  progressArray.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  await Deno.writeTextFile(
    `./progress.json`,
    JSON.stringify(progressArray, null, " "),
  );
}
