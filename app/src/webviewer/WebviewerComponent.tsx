import Spacer from "@/components/ui/Spacer";
import { useEdgeStore } from "@/lib/edgestore";
import { updateDocument } from "@/utils/prisma/document";
import { createSignatory } from "@/utils/prisma/signatory";
import { sendDocumentToSign, sendDocumentSigned } from "@/utils/common";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import WebViewer from "@pdftron/webviewer";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import exportAndUploadDocument from "@/utils/exportAndUploadDocument";

function WebviewerComponent({ documentData }: { documentData: any }) {
  const viewer = useRef(null);
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [instance, setInstance] = useState<any>(null);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [document, setDocument] = useState(documentData.document);
  const storedSignatories = localStorage.getItem("signatories");
  const signatories = storedSignatories ? JSON.parse(storedSignatories) : [];

  useEffect(() => {
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
      instance.UI.enableFeatures([instance.UI.Feature.Initials]);
      const { documentViewer, annotationManager } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        const doc = documentViewer.getDocument();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fieldManager = annotationManager.getFieldManager();
        const fields = fieldManager.getFields();
        logFields(fields);
      });

      documentViewer.addEventListener("annotationsLoaded", async () => {
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
    });
  }, []);

  function logFields(fields: any[]) {
    fields.forEach((field) => {
      console.log("Field type:", field.type);
      console.log("Field name:", field.name);
      console.log("Field value:", field.value);
    });
  }

  const handleFinish = async () => {
    const res = await exportAndUploadDocument(instance, document, edgestore);

    console.log("res:", res);
    console.log("res.url:", res.url);
    console.log("document.url:", document.url);

    try {
      document.url = res.url;
      document.isSigned = true;
      await updateDocument(document);
    } catch (error) {
      console.error("Error in signDocument:", error);
    }
    console.log("res.url:", res.url);
    console.log("document.url:", document.url);

    if (signatories.length === 0) {
      try {
        await sendDocumentSigned(email, document.url);
      } catch (error) {
        console.error("Error in sendDocumentSigned:", error);
      }

      router.push(`/signing-complete/${encodeURIComponent(document.name)}`);
    } else {
      for (const signatory of signatories) {
        console.log("signatory:", signatory);
        await createSignatory(signatory, document.idDocument);
        console.log("sendDocumentToSign:");
        await sendDocumentToSign(signatory.email, document.idDocument);
      }
      console.log("Signatories created successfully");
    }
  };

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
        {/* <div className="option-webviewer">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="signatory-select-label">
                Ajouter une signature pour
              </InputLabel>
              <Select
                labelId="signatory-select-label"
                id="signatory-select"
                value={selectedSignatory}
                label="Ajouter une signature pour"
                onChange={handleChange}
              >
                {signatories.map((signatory: any, index: number) => (
                  <MenuItem key={index} value={signatory.email}>
                    {`${signatory.firstName} ${signatory.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            draggable
            onDragStart={handleDragStart}
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Drag Signature
          </Button>
        </div> */}
      </div>
      <Spacer size={30} />

      <button className="btn-primary" onClick={handleFinish}>
        Terminer
      </button>
    </>
  );
}

export default WebviewerComponent;
