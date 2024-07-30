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
import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import exportAndUploadDocument from "@/utils/exportAndUploadDocument";

function WebviewerComponent() {
  const viewer = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [instance, setInstance] = useState<any>(null);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [selectedSignatory, setSelectedSignatory] = useState("");
  const { document, setDocument } = useDocumentContext();
  const storedSignatories = localStorage.getItem("signatories");
  const signatories = storedSignatories ? JSON.parse(storedSignatories) : [];

  useEffect(() => {
    if (viewer.current && document) {
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
        viewer.current
      ).then((instance) => {
        setInstance(instance);
        const { documentViewer, annotationManager, Annotations } =
          instance.Core;

        documentViewer.loadDocument(document.url);

        documentViewer.addEventListener("annotationsLoaded", async () => {
          const fieldManager = annotationManager.getFieldManager();
          const fields = fieldManager.getFields();
          logFields(fields);
        });

        annotationManager.addEventListener(
          "annotationChanged",
          (annotations, action) => {
            if (
              action === "add" ||
              action === "modify" ||
              action === "delete"
            ) {
              const fieldManager = annotationManager.getFieldManager();
              const fields = fieldManager.getFields();
              logFields(fields);
            }
          }
        );

        const { iframeWindow } = instance.UI;
        const iframeDoc = iframeWindow.document.body;
        iframeDoc.addEventListener("dragover", dragOver);
        iframeDoc.addEventListener("drop", (e) => {
          drop(e, instance);
        });

        instance.UI.enableFeatures([instance.UI.Feature.Initials]);
      });
    }
  }, [document]);

  const dragOver = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    return false;
  };

  const drop = (e: DragEvent, instance: WebViewerInstance) => {
    console.log("drop");
    try {
      const { documentViewer, annotationManager, Annotations } = instance.Core;
      const { WidgetFlags } = Annotations;
      const scrollElement = documentViewer.getScrollViewElement();
      const scrollLeft = scrollElement.scrollLeft || 0;
      const scrollTop = scrollElement.scrollTop || 0;

      const dropX = e.pageX + scrollLeft;
      const dropY = e.pageY + scrollTop;

      const flags = new WidgetFlags();
      flags.set("Required", true);

      const fieldName = `SignatureField_${Date.now()}`;
      const newField = new Annotations.Forms.Field(fieldName, {
        type: "Sig",
        flags,
      });

      console.log("Field type:", newField.type);
      console.log("Field name:", newField.name);
      console.log("Field value:", newField.value);

      // Créer un widget d'annotation de signature
      const widgetAnnot = new Annotations.SignatureWidgetAnnotation(newField, {
        appearance: "_DEFAULT",
        appearances: {
          _DEFAULT: {
            Normal: {
              offset: {
                x: 100,
                y: 100,
              },
            },
          },
        },
      });

      // Définir les propriétés du widget
      widgetAnnot.PageNumber = documentViewer.getCurrentPage();
      widgetAnnot.X = dropX;
      widgetAnnot.Y = dropY;
      widgetAnnot.Width = 150;
      widgetAnnot.Height = 30;

      // Ajouter le champ et le widget au gestionnaire de champs
      annotationManager.getFieldManager().addField(newField);

      // Ajouter et dessiner l'annotation
      annotationManager.addAnnotation(widgetAnnot);
      annotationManager.drawAnnotationsFromList([widgetAnnot]);

      e.preventDefault();
      console.log("drop");
    } catch (error) {
      console.error("Error in drop function:", error);
    }
    return false;
  };

  function logFields(fields: any[]) {
    fields.forEach((field) => {
      console.log("Field type:", field.type);
      console.log("Field name:", field.name);
      console.log("Field value:", field.value);
    });
  }

  const handleFinish = async () => {
    const res = await exportAndUploadDocument(instance, document, edgestore);

    try {
      document.url = res.url;
      document.isSigned = true;
      await updateDocument(document);
    } catch (error) {
      console.error("Error in signDocument:", error);
    }

    if (signatories.length === 0) {
      try {
        await sendDocumentSigned(email, document.url);
      } catch (error) {
        console.error("Error in sendDocumentSigned:", error);
      }

      router.push(`/signing-complete/${encodeURIComponent(document.name)}`);
    } else {
      for (const signatory of signatories) {
        await createSignatory(signatory, document.idDocument);
        await sendDocumentToSign(signatory.email, document.idDocument);
      }
      console.log("Signatories created successfully");
    }
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedSignatory(event.target.value);
  };

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData("text/plain", "signature");
  };

  return (
    <>
      <div
        className="container-webviewer"
        onDragOver={(e) => e.preventDefault()}
        style={{ display: "flex" }}
      >
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
        <div className="option-webviewer">
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
        </div>
      </div>
      <Spacer size={30} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFinish}
        style={{ marginTop: 20 }}
      >
        Terminer
      </Button>
    </>
  );
}

export default WebviewerComponent;
