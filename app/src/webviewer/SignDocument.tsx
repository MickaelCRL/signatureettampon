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
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/router";

function SignDocument({ idDocument }: { idDocument: any }) {
  const viewer = useRef(null);
  const { document, setDocument } = useDocumentContext();
  const [instance, setInstance] = useState<any>(null);
  const { edgestore } = useEdgeStore();
  const { user } = useUserContext();
  const [annotPosition, setAnnotPosition] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const doc = await getDocumentByIdForSignatory(email, idDocument);
        setDocument(doc?.document);
        setLoading(false);
        console.log("doc", doc);
      } catch (error) {
        console.error("Error fetching document:", error);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [idDocument]);

  useEffect(() => {
    if (!document?.url) return;
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
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        annotationManager.addEventListener(
          "annotationChanged",
          (annotations, action, { imported }) => {
            if (imported && action === "add") {
              annotations.forEach((annot: any) => {
                if (annot instanceof Annotations.WidgetAnnotation) {
                  if (!annot.fieldName.startsWith(email)) {
                    annot.Hidden = true;
                    annot.Listable = false;
                  }
                }
              });
            }
          }
        );

        const annots = annotationManager.getAnnotationsList();
        annots.forEach((annot) => {
          if (annot instanceof Annotations.WidgetAnnotation) {
            if (!annot.fieldName.startsWith(email)) {
              annot.Hidden = true;
              annot.Listable = false;
            }
          }
        });

        setInstance(instance);
      });
    });
  }, [document]);

  const nextField = () => {
    const annots = instance?.Core.annotationManager.getAnnotationsList() || [];
    if (annots[annotPosition]) {
      instance?.Core.annotationManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition + 1]) {
        setAnnotPosition(annotPosition + 1);
      }
    }
  };

  const prevField = () => {
    const annots = instance?.Core.annotationManager.getAnnotationsList() || [];
    if (annots[annotPosition]) {
      instance?.Core.annotationManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition - 1]) {
        setAnnotPosition(annotPosition - 1);
      }
    }
  };

  async function handleFinish() {
    const res = await exportAndUploadDocument(instance, document, edgestore);
    await updateSignatoryStatus(email, true);

    // Redirection vers l'écran de base
    router.push("/"); // Assurez-vous que "/" est le bon chemin pour votre écran de base
  }

  if (loading) return <div>Loading...</div>;

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

      <button className="btn-primary" onClick={prevField}>
        Previous Field
      </button>

      <Spacer size={30} />

      <button className="btn-primary" onClick={nextField}>
        Next Field
      </button>

      <Spacer size={30} />

      <button className="btn-primary" onClick={handleFinish}>
        Terminer
      </button>
    </>
  );
}

export default SignDocument;
