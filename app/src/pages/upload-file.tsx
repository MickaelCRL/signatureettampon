"use client";

import { useRouter } from "next/router";
import Header from "@/components/magic/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import Spacer from "@/components/ui/Spacer";
import {
  MultiFileDropzone,
  type FileState,
} from "@/edgestore/MultiFileDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import TokenContext from "@/utils/TokenContext";
import AddSignatoryComponent from "@/webviewer/AddSignatoryComponent";
import { SetStateAction, useContext, useState } from "react";
import Dropzone from "@/edgestore/Dropzone";
import { createDocument, getUserEnvelope } from "@/utils/common";
import { get } from "http";
import { Prisma } from "@prisma/client";

function PageUploadFile() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const [documentInfo, setDocumentInfo] = useState<{
    name: string;
    url: string;
    hash: string;
  } | null>(null);

  async function handleNextClick() {
    if (documentInfo) {
      const email = localStorage.getItem("email") || "";
      const envelope = await getUserEnvelope(email);

      console.log("Document info:", documentInfo);
      console.log("Email:", email);
      console.log("Envelope:", envelope);

      await createDocument({
        ...documentInfo,
        isSigned: false,
        envelope,
      });

      await router.push("/sign-document");
    }
  }

  return (
    <>
      <MagicProvider>
        <Header isLoggedIn={true} token={token} setToken={setToken} />
        <Spacer size={30}></Spacer>
        <p className="title-center">Ajouter des documents </p>
        <div
          style={{
            border: "1px solid #ccc",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Dropzone onUploadComplete={setDocumentInfo}></Dropzone>
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
