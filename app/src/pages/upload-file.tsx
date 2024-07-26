"use client";

import Header from "@/components/magic/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import Spacer from "@/components/ui/Spacer";
import Dropzone from "@/edgestore/Dropzone";
import { createDocument } from "@/utils/prisma/document";
import { getUserEnvelope } from "@/utils/prisma/envelope";
import DocumentContext from "@/utils/DocumentContext";
import TokenContext from "@/utils/TokenContext";
import AddSignatoryComponent from "@/webviewer/AddSignatoryComponent";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { set } from "zod";

function PageUploadFile() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { document, setDocument } = useContext(DocumentContext);

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

      setDocument(documentCreated);

      await router.push({
        pathname: "/sign-document",
      });
    }
  }

  return (
    <>
      <MagicProvider>
        <Header isLoggedIn={true} token={token} setToken={setToken} />
        <Spacer size={30}></Spacer>
        <p className="title-center">Ajouter un document </p>
        <div
          style={{
            border: "1px solid #ccc",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Dropzone onUploadComplete={setDocument}></Dropzone>
        </div>
        <Spacer size={30}></Spacer>
        <AddSignatoryComponent></AddSignatoryComponent>

        <Spacer size={30}></Spacer>

        <button onClick={handleNextClick} className="btn-primary">
          Suivant
        </button>
        <Spacer size={30}></Spacer>
      </MagicProvider>
    </>
  );
}

export default PageUploadFile;
