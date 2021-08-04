import { getFiles } from "./commercial-bundle.ts";
import type { File } from "./commercial-bundle.ts";

// getFiles("main");

const commitDates = {
  "afce864c2599b824f8cdf88e7a22b6c4eb2bdd00": "2021-08-02 11:27:02 +0100",
  "1f46e8df8163d505ee03760ff2b45f819e4d6df2": "2021-07-30 10:00:33 +0100",
  "03c1e9fac0a6b3fd19ed017dd67e8ee7ae63b338": "2021-07-26 12:06:20 +0100",
  "e2b57978096f5aacadad0f54d4c51001ba0dacc6": "2021-07-22 17:14:16 +0100",
  "c16f9a78480421ad5cc729e8ea4bb54a1148793f": "2021-07-22 11:24:08 +0100",
  "3bb1f605a14bd8efc427667afa8418847830d252": "2021-07-13 10:15:37 +0100",
  "e45695f217cb50a6c649231fd41e5494f847b506": "2021-07-09 13:25:39 +0100",
  "b22a9e85ea4d7aec463c30c4d8d8eea19969c0ca": "2021-07-05 14:33:55 +0100",
  "e7bf10462e65f0e31021b2c57b3d2e1c9210c505": "2021-07-01 17:40:29 +0100",
  "19d404bcaf74091a7c5a40f0bd5a516fb847f1a1": "2021-06-28 13:33:32 +0100",
  "d6eaa9b433251f0b1d6e46b6aaf3b4d86e8ce12a": "2021-06-23 16:23:21 +0100",
  "2d85e426a2323c9fc60ac5fa82a9b24572b49aad": "2021-06-16 17:25:55 +0100",
  "56365a13c848a89ae3b07a8621cc72b7612f266f": "2021-06-10 14:31:32 +0100",
  "4a0c4856b06b2427f8cdfdfdda042a801baf2861": "2021-06-04 18:20:32 +0100",
  "3b9703bebd50961b6b914f8989339e1bdcfe8936": "2021-06-02 12:22:28 +0100",
  "a0a8179418f7c7c7e1d9247a9cdaf7d671a37985": "2021-05-13 13:25:31 +0100",
  "5143cc6dfd488b43ff0cc7ab4c35fe8a90dbd268": "2021-05-05 16:04:08 +0100",
  "af8b840b7f4108f7980603dd2dfa2174110f3a49": "2021-03-10 13:40:19 +0000",
};

const commitPrs: Partial<Record<Sha, number>> = {
  "afce864c2599b824f8cdf88e7a22b6c4eb2bdd00": 24045,
  "1f46e8df8163d505ee03760ff2b45f819e4d6df2": 24044,
  "03c1e9fac0a6b3fd19ed017dd67e8ee7ae63b338": 24025,
  "19d404bcaf74091a7c5a40f0bd5a516fb847f1a1": 23946,
  "3b9703bebd50961b6b914f8989339e1bdcfe8936": 23863,
  "af8b840b7f4108f7980603dd2dfa2174110f3a49": 23594,
};

type Sha = keyof typeof commitDates;

type Progress = {
  date: string;
  prLink?: string;
  percentage: number;
  typed: number;
  typedSize: number;
  untyped: number;
  untypedSize: number;
  sha: Sha;
};

const progressArray: Progress[] = [];
const path = "./trees";
for await (const file of Deno.readDir(path)) {
  const data: File[] | null = file.isFile
    ? JSON.parse(await Deno.readTextFile(path + "/" + file.name))
    : null;

  if (data) {
    const sha = file.name.replace(".json", "");

    if (validSha(sha)) {
      const files = data.filter((f) => !f.path.includes(".spec."));
      const _tests = data.filter((f) => f.path.includes(".spec."));
      const typed = files.filter((f) => f.path.includes(".ts"));
      const untyped = files.filter((f) => f.path.includes(".js"));

      const sum = (p: number, c: File) => p + c.size;

      const progress: Progress = {
        date: commitDates[sha],
        typed: typed.length,
        typedSize: typed.reduce(sum, 0),
        untyped: untyped.length,
        untypedSize: untyped.reduce(sum, 0),
        percentage: typed.length / untyped.length,
        sha,
      };

      if (commitPrs[sha]) {
        progress.prLink = "https://github.com/guardian/frontend/pull/" +
          commitPrs[sha];
      }

      progressArray.push(progress);
    }
  }

  progressArray.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  await Deno.writeTextFile(
    `./progress.json`,
    JSON.stringify(progressArray, null, " "),
  );
}

function validSha(sha: string): sha is Sha {
  return Object.keys(commitDates).includes(sha);
}

// Object.keys(commitDates).forEach(async (sha) => {
//   const cmd = Deno.run({
//     cmd: [
//       "git",
//       //   "--no-pager",
//       "show",
//       "-s",
//       "--format=%ci",
//       sha,
//     ],
//     stdout: "piped",
//   });

//   const output = await cmd.output();
//   const date = new TextDecoder().decode(output).replaceAll("\n", "");

//   console.log(`"${sha}": "${date}",`);
// });
