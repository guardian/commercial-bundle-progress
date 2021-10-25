import { svg } from "./directed-graph.ts";
import { getDataForHash } from "./data.ts";
import { updateSimulationData } from "./simulation.ts";
import { updateSvgData } from "./directed-graph.ts";

const directedGraph = document.querySelector("#directed-graph");

const fragment = document.createDocumentFragment();
const hashes = [
  "287ac0a948594e2f95d0fe0e5791d6dce959456c",
  "7b5644d4cd64b44e7ba6f6936805fd54867adefb",

  "525e8ede60bafb0e39fbbe1c0c58c172da5902e5",
  "62797775c74d1bd9816de5462d0f4c4fee056913",

  "6a8a44ff760108b8ba65affae1191075c1fb85ef",
  "0ef087d59aa471aaaa246c871a39de19d31095a2",

  "dee55cef7942540b0d59542138f363cdc05a73b3",
  "2d7947a74dcd595fd303a092a5ecd34a03a0e038",

  "fb736888d59b8cd90a8528b1f3a8bc76f13e4faa",
  "cd65f904875dfeef24e4b35404e97283c7429af7",

  "626158617757fbd4c49da24aec73468c37467a56",
  "b4af0030b85970e752f9f64b85e82b20f4487ed7",
  "e100b13ba833653d1d32d0c04f217779e3c6ebb2",
  "79b05f1b10ad0d33076fae4b772cc7ce5e00c48d",
  "410d5417877b0d6ca13860dda79606d133368389",

  "2e82565dec2bf3d837536833b97e0813702796a9",
  "09a82d56786e143f376b2ad6e2c53ffdf56d6aa6",
  "c789dda9024cdcb62d77eea8e47cbf51f5e7826f",

  "ddc8edd599704da7e0399b8d8bb9d2f95f766a1e",
  "42889a8411b950581a650f7ed9253911d36d68eb",
  "9fa01f89bef833452bfc1d24b0cdd5de5dfe0108",
  "f6deab14f8ad595dd87e1641de320f150f4ef406",
  "86a5b6766098fd7515b7b0e1715be9fdc5553165",

  "main",
];

const updateGraph = async (hash) => {
  const data = await getDataForHash(hash);
  const simulation = updateSimulationData(data);

  updateSvgData(data, simulation);
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

directedGraph.appendChild(svg.node());
directedGraph.appendChild(fragment);
