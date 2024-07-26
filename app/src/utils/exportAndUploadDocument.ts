const exportAndUploadDocument = async (
  instance: any,
  document: any,
  edgestore: any
) => {
  const { documentViewer, annotationManager } = instance.Core;
  const doc = documentViewer.getDocument();

  const xfdfString = await annotationManager.exportAnnotations();
  const options = { xfdfString, flatten: true };

  const data = await doc.getFileData(options);
  const arr = new Uint8Array(data);
  const blob = new Blob([arr], { type: "application/pdf" });

  const file = new File([blob], document.name, {
    type: "application/pdf",
  });

  const res = await edgestore.publicFiles.upload({
    file,
    options: {
      replaceTargetUrl: document.url,
    },
  });

  return res;
};

export default exportAndUploadDocument;
