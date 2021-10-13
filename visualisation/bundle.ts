try {
  const { files, diagnostics } = await Deno.emit("./index.js", {
    bundle: "module",
    check: false,
    // sources: {
    //   "./d3.ts": "",
    //   "./directed-graph.ts": "",
    // },
  });

  if (diagnostics.length) {
    // there is something that impacted the emit
    console.warn(Deno.formatDiagnostics(diagnostics));
  }

  for (const [fileName, text] of Object.entries(files)) {
    const cleanName = fileName
      .replace("deno:///", "")
      .replace("https://", "external/");

    console.log(`emitted ${cleanName} with a length of ${text.length}`);
    await Deno.writeTextFile(
      "./public/build/" +
        cleanName,
      text,
    );
  }
} catch (error) {
  console.log(error);
}
