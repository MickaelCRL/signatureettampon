"use client";

import Header from "@/components/magic/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import Spacer from "@/components/ui/Spacer";
import Dropzone from "@/edgestore/Dropzone";
import { createDocument, getUserEnvelope } from "@/utils/common";
import TokenContext from "@/utils/TokenContext";
import AddSignatoryComponent from "@/webviewer/AddSignatoryComponent";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

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

      await router.push({
        pathname: "/sign-document",
        query: { documentUrl: documentInfo.url },
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
