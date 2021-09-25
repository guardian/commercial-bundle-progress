import { svg } from "./directed-graph.ts";

document.body.appendChild(svg.node());

const fragment = document.createDocumentFragment();
const hashes = [
    "287ac0a948594e2f95d0fe0e5791d6dce959456c",
    "7b5644d4cd64b44e7ba6f6936805fd54867adefb",
    // "eec87b69eb48f91afe67a18a8f9ee943299a46b6",
    // "f30464ad5489f86b389635008d591048c2645571",
    // "9161f9cb1e559701b931dcb4969b4076fdbecad5",
    "525e8ede60bafb0e39fbbe1c0c58c172da5902e5",
    "62797775c74d1bd9816de5462d0f4c4fee056913",
    // "ff35a6ef70bb73efcb1add432317bbb6a0003ade",
    "6a8a44ff760108b8ba65affae1191075c1fb85ef",
    "0ef087d59aa471aaaa246c871a39de19d31095a2",
    // "588ca694d41b5defdc8d9acd8a886a3ee29b3317",
    "f6fb3aa53acb94b4ca47e8996e28cfe33918ea83",
    "dee55cef7942540b0d59542138f363cdc05a73b3",
    "2d7947a74dcd595fd303a092a5ecd34a03a0e038",
    // "3ca3b7fd60a653bd0c7aba6f03bfbd331e49b802",
    "fb736888d59b8cd90a8528b1f3a8bc76f13e4faa",
    "cd65f904875dfeef24e4b35404e97283c7429af7",

    // "c49b1153972d12cb308c44bb693fba563fac3d9d",
    // "5ada8ce01f97f7aa96ee26874c1cb5684c98b604",
    // "5a7ed969b126d7aa2dc937d5d795845e125ef15e",
    // "89c18e67de96465509d291aaa1e2c6dba4452f6e",
    // "a4578059feed0c628a51dbb8c794c1fe63861a20",
    // "9c6a35598aa2950b3ba02887284fc99d8408baec",

    "626158617757fbd4c49da24aec73468c37467a56",
    "b4af0030b85970e752f9f64b85e82b20f4487ed7",
    "e100b13ba833653d1d32d0c04f217779e3c6ebb2",
    "79b05f1b10ad0d33076fae4b772cc7ce5e00c48d",
    "410d5417877b0d6ca13860dda79606d133368389",

    "main",
];

const updateGraph = async (hash) => {

    const data = await getDataforHash(hash);
    const simulation = updateSimulationData(data);

    updateSvgData(data, simulation);
};
updateGraph("main")

for (const hash of hashes) {
const button = document.createElement('button')
button.innerText = hash.substring(0, 8);
fragment.appendChild(button);
button.addEventListener("click", () => {
    updateGraph(hash);
})
}


document.body.appendChild(fragment)