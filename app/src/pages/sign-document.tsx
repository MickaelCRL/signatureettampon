import React from "react";
import WebviewerComponent from "@/webviewer/WebviewerComponent";
import Header from "@/components/magic/Header";
import Spacer from "@/components/ui/Spacer";

function PageSigndocument() {
  return (
    <>
      <Header isLoggedIn={true} />
      <Spacer size={30} />
      <WebviewerComponent />
      <Spacer size={30} />
      <button className="btn-primary">Terminer</button>
      <Spacer size={30} />
    </>
  );
}

export default PageSigndocument;
