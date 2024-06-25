import React, { useContext, useEffect, useState } from "react";
import WebviewerComponent from "@/webviewer/WebviewerComponent";
import Header from "@/components/magic/Header";
import Spacer from "@/components/ui/Spacer";
import { LoginProps } from "@/utils/types";
import TokenContext from "@/utils/TokenContext";
import MagicProvider from "@/components/magic/MagicProvider";
import { ToastContainer } from "react-toastify";
import Login from "@/components/magic/Login";
import MagicDashboardRedirect from "@/components/magic/MagicDashboardRedirect";

function PageSigndocument() {
  const { token, setToken } = useContext(TokenContext);
  return (
    <>
      <MagicProvider>
        <ToastContainer />
        {process.env.NEXT_PUBLIC_MAGIC_API_KEY ? (
          token.length > 0 ? (
            <>
              <Header isLoggedIn={true} token={token} setToken={setToken} />
              <Spacer size={30} />
              <WebviewerComponent />
              <Spacer size={30} />
              <button className="btn-primary">Terminer</button>
              <Spacer size={30} />
            </>
          ) : (
            <Login token={token} setToken={setToken} />
          )
        ) : (
          <MagicDashboardRedirect />
        )}
      </MagicProvider>
    </>
  );
}

export default PageSigndocument;
