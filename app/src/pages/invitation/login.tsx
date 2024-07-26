import MagicProvider from "../../components/magic/MagicProvider";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/components/magic/Login";
import Dashboard from "@/components/magic/Dashboard";
import MagicDashboardRedirect from "@/components/magic/MagicDashboardRedirect";
import TokenContext from "@/utils/TokenContext";
import InvitationToSignDocument from "./[idDocument]";
import { useRouter } from "next/router";

function login() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { idDocument } = router.query;

  useEffect(() => {
    if (token.length > 0 && idDocument) {
      router.push(`/invitation/${idDocument}`);
    }
  }, [token, idDocument]);

  return (
    <MagicProvider>
      <ToastContainer />
      {process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
        token.length > 0 ? (
          // go to page invitation/idDocument
          <p>Redirection en cours...</p>
        ) : (
          <Login token={token} setToken={setToken} />
        )
      ) : (
        <MagicDashboardRedirect />
      )}
    </MagicProvider>
  );
}

export default login;
