import Spacer from "@/components/ui/Spacer";
import exportAndUploadDocument from "@/utils/exportAndUploadDocument";
import {
  getDocumentByIdForSignatory,
  updateSignatoryStatus,
} from "@/utils/prisma/signatory";
import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useDocumentContext } from "@/context/DocumentContext";
import { set } from "zod";
import signatory from "@/pages/api/db/signatory";

function SignDocument({ idDocument }: { idDocument: any }) {
  const viewer = useRef(null);
  const { document, setDocument } = useDocumentContext();
  const [instance, setInstance] = useState<any>(null);
  const { edgestore } = useEdgeStore();
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  useEffect(() => {
    console.log("email", email);
    const fetchDocument = async () => {
      try {
        const doc = await getDocumentByIdForSignatory(email, idDocument);
        setDocument(doc?.document);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [email, idDocument]);

  useEffect(() => {
    console.log("document :", document);
    console.log("document url :", document.url);
    WebViewer(
      {
        path: "/webviewer/lib",
        licenseKey:
          "demo:1718657188013:7fbff2190300000000ddadd08e42549a2cea8d0bb514c40e12f3b0ac02",
        initialDoc: document.url,
        disabledElements: [
          "rubberStampToolGroupButton",
          "signatureToolGroupButton",
          "stampToolGroupButton",
          "fileAttachmentToolGroupButton",
          "calloutToolGroupButton",
          "eraserToolButton",
          "undoButton",
          "redoButton",
          "toolsHeader",
        ],
      },
      viewer.current!
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      // Ensure the document is fully loaded
      documentViewer.addEventListener("documentLoaded", async () => {
        const doc = documentViewer.getDocument();

        // Wait for annotations to be loaded
        await new Promise((resolve) => setTimeout(resolve, 1000));

        documentViewer.addEventListener("annotationsLoaded", async () => {
          const fieldManager = annotationManager.getFieldManager();
          const fields = fieldManager.getFields();
          console.log("Fields:", fields);
        });

        // Fetch the annotations
        const annotations = annotationManager.getAnnotationsList();

        console.log("Annotations:", annotations);

        // Display annotations or perform other actions

        setInstance(instance);
      });
    });
  }, []);

  async function handleFinish() {
    const res = await exportAndUploadDocument(instance, document, edgestore);

    await updateSignatoryStatus(email, true);
  }

  return (
    <>
      <div className="container-webviewer">
        <div
          className="webviewer"
          ref={viewer}
          style={{
            height: "100vh",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        ></div>
      </div>
      <Spacer size={30} />

      <button className="btn-primary" onClick={handleFinish}>
        Terminer
      </button>
    </>
  );
}

export default SignDocument;
