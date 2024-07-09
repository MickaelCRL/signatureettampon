async function main() {
  const buf = await doc.saveMemoryBuffer(
    PDFNet.SDFDoc.SaveOptions.e_incremental
  );

  //optionally save the blob to a file or upload to a server
  const blob = new Blob([buf], { type: "application/pdf" });
}
PDFNet.runWithCleanup(main);
