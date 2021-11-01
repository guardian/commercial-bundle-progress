import type { File, Tree } from "./commercial-bundle.ts";

const commitDates = {
  "a56f0adc12282729743aef3e8b0c12931ef7e6fa": "2021-11-01",
  "aa3dc8f462de94f261fe013489a9e9ee8c4c1214": "2021-10-28",
  "7282823f3d8c10c4b6eee9c87ba62560bb6392db": "2021-10-25",
  "71d171f79144da76003f5d850de89083b0a3a3da": "2021-10-13",
  "c789dda9024cdcb62d77eea8e47cbf51f5e7826f": "2021-10-12",
  "ba1389daf75b0ba45bf65c33a05c4cc00f48d7b5": "2021-10-11",
  "be7a297a6a313d5ec37fdf93e2ae0b6af55ed1ce": "2021-10-11",
  "5b36d0edf6be857c16fb2c1c39399e1b70956bf6": "2021-10-05",
  "ceaab828fb7e851c0413cbbe4f709eeaf7f7b4f7": "2021-10-04",

  "879404d7d271c10879ce6bb05e5a6c1a9f9f068a": "2021-09-28",
  "93f6b71efba697735006e32c70e1b9ee5874cb6e": "2021-09-28",
  "a690f978a177b13ca1bcd71c8d7a86da8242cb16": "2021-09-27",
  "7317ca6d9a04a3126b231656821df1b1e7cf1381": "2021-09-23",
  "b4af0030b85970e752f9f64b85e82b20f4487ed7": "2021-09-23",
  "79b05f1b10ad0d33076fae4b772cc7ce5e00c48d": "2021-09-23",
  "626158617757fbd4c49da24aec73468c37467a56": "2021-09-23",
  "bcef4a9197c134a1e6a6b16a4e2d893af8f80f33": "2021-09-07",
  "062507eed21dc403be557b2e919f9a7ccfbe92c9": "2021-09-01",

  "6845baacb3ee9d46bce79ffb098f5f339f898a4d": "2021-08-23",
  "47fda6f771a90e0b16d94c577ed20dba1b492b50": "2021-08-16",
  "5a9ef6dc74572d5d901ec94247b3e01c727babdf": "2021-08-12",
  "afce864c2599b824f8cdf88e7a22b6c4eb2bdd00": "2021-08-02",

  "1f46e8df8163d505ee03760ff2b45f819e4d6df2": "2021-07-30",
  "03c1e9fac0a6b3fd19ed017dd67e8ee7ae63b338": "2021-07-26",
  "e2b57978096f5aacadad0f54d4c51001ba0dacc6": "2021-07-22",
  "c16f9a78480421ad5cc729e8ea4bb54a1148793f": "2021-07-22",
  "3bb1f605a14bd8efc427667afa8418847830d252": "2021-07-13",
  "e45695f217cb50a6c649231fd41e5494f847b506": "2021-07-09",
  "b22a9e85ea4d7aec463c30c4d8d8eea19969c0ca": "2021-07-05",
  "e7bf10462e65f0e31021b2c57b3d2e1c9210c505": "2021-07-01",

  "19d404bcaf74091a7c5a40f0bd5a516fb847f1a1": "2021-06-28",
  "d6eaa9b433251f0b1d6e46b6aaf3b4d86e8ce12a": "2021-06-23",
  "2d85e426a2323c9fc60ac5fa82a9b24572b49aad": "2021-06-16",
  "56365a13c848a89ae3b07a8621cc72b7612f266f": "2021-06-10",
  "4a0c4856b06b2427f8cdfdfdda042a801baf2861": "2021-06-04",
  "3b9703bebd50961b6b914f8989339e1bdcfe8936": "2021-06-02",

  "a0a8179418f7c7c7e1d9247a9cdaf7d671a37985": "2021-05-13",
  "5143cc6dfd488b43ff0cc7ab4c35fe8a90dbd268": "2021-05-05",

  "00691d84f609105e876617beb791903c526a13d1": "2021-04-12",

  "af8b840b7f4108f7980603dd2dfa2174110f3a49": "2021-03-10",
};

const commitPrs: Partial<Record<Sha, number>> = {
  "71d171f79144da76003f5d850de89083b0a3a3da": 24260,
  "bcef4a9197c134a1e6a6b16a4e2d893af8f80f33": 24148,
  "062507eed21dc403be557b2e919f9a7ccfbe92c9": 24132,
  "6845baacb3ee9d46bce79ffb098f5f339f898a4d": 24106,
  "5a9ef6dc74572d5d901ec94247b3e01c727babdf": 24097,
  "47fda6f771a90e0b16d94c577ed20dba1b492b50": 24071,
  "afce864c2599b824f8cdf88e7a22b6c4eb2bdd00": 24045,
  "1f46e8df8163d505ee03760ff2b45f819e4d6df2": 24044,
  "03c1e9fac0a6b3fd19ed017dd67e8ee7ae63b338": 24025,
  "19d404bcaf74091a7c5a40f0bd5a516fb847f1a1": 23946,
  "3b9703bebd50961b6b914f8989339e1bdcfe8936": 23863,
  "af8b840b7f4108f7980603dd2dfa2174110f3a49": 23594,
};

type Sha = keyof typeof commitDates;

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
  sha: Sha;
};

const progressArray: Progress[] = [];
const path = "./trees";
for await (const file of Deno.readDir(path)) {
  const data: Tree | null = file.isFile
    ? JSON.parse(await Deno.readTextFile(path + "/" + file.name))
    : null;

  if (data) {
    const { sha, date, author } = data;

    if (validSha(sha)) {
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
