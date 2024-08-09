import Header from "@/components/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import TokenContext from "@/utils/TokenContext";
import { LoginProps } from "@/utils/types";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Spacer from "@/components/ui/Spacer";
import dynamic from "next/dynamic";

function InvitationToSignDocument() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { idDocument } = router.query;

  const SignDocument = dynamic(() => import("@/webviewer/SignDocument"), {
    ssr: false,
  });

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
