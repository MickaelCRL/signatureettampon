import Spacer from "@/components/ui/Spacer";
import { useEdgeStore } from "@/lib/edgestore";
import { sendDocumentSigned } from "@/utils/common";
import WebViewer from "@pdftron/webviewer";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

function WebviewerComponent({ documentUrl }: { documentUrl: string }) {
  const viewer = useRef(null);
  const router = useRouter();
  const [documentName, setDocumentName] = useState<string>("");
  const { edgestore } = useEdgeStore();
  const [instance, setInstance] = useState<any>(null);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        licenseKey:
          "demo:1718657188013:7fbff2190300000000ddadd08e42549a2cea8d0bb514c40e12f3b0ac02",
        initialDoc: documentUrl,
        // enableFilePicker: true,
        // fullAPI: true,
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
      instance.UI.enableFeatures([instance.UI.Feature.Initials]);
      const { documentViewer, annotationManager } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        const doc = documentViewer.getDocument();
        const nbPage = documentViewer.getPageCount();
        setDocumentName(doc.getFilename());

        console.log("Document loaded:", doc);
        console.log("Document name:", documentName);
        console.log("Page count:", nbPage);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const fieldManager = annotationManager.getFieldManager();
        const fields = fieldManager.getFields();

        logFields(fields);
      });

      annotationManager.addEventListener(
        "annotationChanged",
        (annotations, action) => {
          const fieldManager = annotationManager.getFieldManager();
          const fields = fieldManager.getFields();
          if (action === "add") {
            console.log("this is a change that added annotations");
          } else if (action === "modify") {
            console.log("this change modified annotations");
          } else if (action === "delete") {
            console.log("there were annotations deleted");
          }

          logFields(fields);
        }
      );

      setInstance(instance);
      return instance;
    });
  }, []);

  function logFields(fields: any[]) {
    fields.forEach((field) => {
      console.log("Field type:", field.type);
      console.log("Field name:", field.name);
      console.log("Field value:", field.value);
      console.log("Field initial signatories", field.initialSignatories);
      console.log("Field nb signature", field.nbSignature);
    });
  }

  // console.log("Field page:", field.widgets![0].PageNumber);
  function verifyFields(_fields: any[], _nbPage: number) {
    let nbInitials: number;
    let nbSignature: number;

    console.log("Verifying fields clicked");

    for (let i = 0; i < _nbPage; i++) {
      nbInitials = 0;
      nbSignature = 0;

      _fields.forEach((field) => {
        if (field.widgets[0].PageNumber !== i + 1) {
          return;
        }

        if (field.type === "Sig") {
          nbSignature++;
          if (field.value === "") {
            console.log("Signature not filled correctly");
            return false;
          } else {
            console.log("Signature filled correctly");
            return true;
          }
        }

        if (field.type === "initial") {
          nbInitials++;
          if (field.value === "") {
            console.log("Initials not filled correctly");
            return false;
          } else {
            console.log("Initials filled correctly");
            return true;
          }
        }
      });
    }
  }

  const handleFinish = async () => {
    const storedSignatories = localStorage.getItem("signatories");
    const signatories = storedSignatories ? JSON.parse(storedSignatories) : [];

    if (signatories.length === 0) {
      if (instance) {
        const { documentViewer, annotationManager } = instance.Core;
        const doc = documentViewer.getDocument();

        const xfdfString = await annotationManager.exportAnnotations();
        const options = { xfdfString, flatten: true };

        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: "application/pdf" });

        const file = new File([blob], documentName, {
          type: "application/pdf",
        });

        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: documentUrl,
          },
        });

        try {
          await sendDocumentSigned(email, res.url);
        } catch (error) {
          console.error("Error in sendDocumentSigned:", error);
        }

        router.push(`/signing-complete/${encodeURIComponent(documentName)}`);
      } else {
        alert("Please complete all signatures before finishing.");
      }
    }
  };
  const isDoocument = !documentName;
  return (
    <>
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
      <Spacer size={30} />

      <button
        className="btn-primary"
        onClick={handleFinish}
        disabled={isDoocument}
      >
        Terminer
      </button>
    </>
  );
}

export default WebviewerComponent;
