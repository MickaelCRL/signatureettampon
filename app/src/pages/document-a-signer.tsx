"use client";

import Header from "@/components/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import Dropzone from "@/edgestore/Dropzone";
import { createDocument } from "@/utils/prisma/document";
import { getUserEnvelope } from "@/utils/prisma/envelope";
import { useDocumentContext } from "@/context/DocumentContext";
import TokenContext from "@/utils/TokenContext";
import AddSignatoryComponent from "@/webviewer/AddSignatoryComponent";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { set } from "zod";

function PageUploadFile() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { document, setDocument } = useDocumentContext();

  async function handleNextClick() {
    if (document) {
      const email = localStorage.getItem("email") || "";
      const envelope = await getUserEnvelope(email);

      console.log("Document info:", document);
      console.log("Email:", email);
      console.log("Envelope:", envelope);

      const documentCreated = await createDocument({
        ...document,
        isSigned: false,
        envelope,
      });

      console.log("Document created:", documentCreated);

      setDocument(documentCreated.document);

      await router.push({
        pathname: "/sign-document",
      });
    }
  }

  return (
    <>
      <MagicProvider>
        <Header isLoggedIn={true} token={token} setToken={setToken} />

        <p className="title-center">Ajouter un document </p>

        <Dropzone></Dropzone>

        <AddSignatoryComponent></AddSignatoryComponent>

        <button onClick={handleNextClick} className="btn-primary">
          Suivant
        </button>
      </MagicProvider>
    </>
  );
}

export default PageUploadFile;
