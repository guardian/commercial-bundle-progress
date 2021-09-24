try {
  const { files, diagnostics } = await Deno.emit("./index.js", {
    bundle: "module",
    check: false,
  });

  if (diagnostics.length) {
    // there is something that impacted the emit
    console.warn(Deno.formatDiagnostics(diagnostics));
  }

  for (const [fileName, text] of Object.entries(files)) {
    console.log(`emitted ${fileName} with a length of ${text.length}`);
    await Deno.writeTextFile(
      "./public/build/" + fileName.replace("deno:///", ""),
      text,
    );
  }
} catch (error) {
  console.log(error);
}
