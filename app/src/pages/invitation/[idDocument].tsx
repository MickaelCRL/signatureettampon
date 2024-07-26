import Header from "@/components/magic/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import TokenContext from "@/utils/TokenContext";
import { LoginProps } from "@/utils/types";
import WebviewerComponent from "@/webviewer/WebviewerComponent";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import SignDocument from "../../webviewer/SignDocument";
import Spacer from "@/components/ui/Spacer";

function InvitationToSignDocument() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { idDocument } = router.query;
  return (
    <>
      <MagicProvider>
        <Header isLoggedIn={true} token={token} setToken={setToken} />
        <Spacer size={30}></Spacer>
        <SignDocument idDocument={idDocument} />;
      </MagicProvider>
    </>
  );
}

export default InvitationToSignDocument;
