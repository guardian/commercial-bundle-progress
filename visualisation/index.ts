import { svg } from "./directed-graph.ts";
import { getDataForHash, getFolders } from "./data.ts";
import { updateSimulationData } from "./simulation.ts";
import { updateSvgData } from "./directed-graph.ts";

const directedGraph = document.querySelector("#directed-graph");

const fragment = document.createDocumentFragment();
const hashes = [
  "287ac0a948594e2f95d0fe0e5791d6dce959456c",
  "7b5644d4cd64b44e7ba6f6936805fd54867adefb",

  "525e8ede60bafb0e39fbbe1c0c58c172da5902e5",
  "62797775c74d1bd9816de5462d0f4c4fee056913",
  "2e82565dec2bf3d837536833b97e0813702796a9",
  "c789dda9024cdcb62d77eea8e47cbf51f5e7826f",

  "7282823f3d8c10c4b6eee9c87ba62560bb6392db", // load-advert
  "8908ed8fe13dc468a9738545009e7e6b92ea567b", // prepare-prebid

  "ceaab828fb7e851c0413cbbe4f709eeaf7f7b4f7", // Chris
  "12bebb6d991ecb93335241932a58753c68406055", // Simon
  "633744df8396c01ebc93b5fab90e64dfb6793a2a", // Fred
  "edafeadc33d0b1ad17b91e2055232e62252c713d", // Zeke
  "a03cf57de93c0a789e78ee9cba90471a217ca5c6", // Ravi

  "main",
];

const updateGraph = async (hash: string) => {
  const data = await getDataForHash(hash);
  const folders = await getFolders(hash);
  const simulation = updateSimulationData(data, folders);

  updateSvgData(data, simulation, folders);
};
updateGraph("main");

for (const hash of hashes) {
  const button = document.createElement("button");
  button.innerText = hash.substring(0, 6);
  fragment.appendChild(button);

  button.addEventListener("click", () => {
    updateGraph(hash);
  });
}

if (directedGraph) {
  const node = svg.node();
  node && directedGraph.appendChild(node);
  directedGraph.appendChild(fragment);
}

const largeFilesList = document.querySelector("#largest-files");

fetch("build/largest-files.json").then((r) => r.json()).then(
  (files: Array<[number, string]>) => {
    files.forEach((file) => {
      const [size, path] = file;
      const li = document.createElement("li");
      li.textContent = `${(size / 1000).toFixed(2)}kB : ${path}`;
      largeFilesList?.appendChild(li);
    });
  },
);
