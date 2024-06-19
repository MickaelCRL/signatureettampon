import WebViewer from "@pdftron/webviewer";
import React from "react";
import { useEffect, useRef } from "react";

function WebviewerComponent() {
  const viewer = useRef(null);

  useEffect(() => {
    import("@pdftron/webviewer").then(() => {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1718657188013:7fbff2190300000000ddadd08e42549a2cea8d0bb514c40e12f3b0ac02",
          initialDoc: "",
          enableFilePicker: true,
        },
        viewer.current!
      ).then((instance) => {
        instance.UI.enableFeatures([instance.UI.Feature.Initials]);
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <div className="header">Signature et tampon</div>
      <div
        className="webviewer"
        ref={viewer}
        style={{ height: "1000vh" }}
      ></div>
    </div>
  );
}

export default WebviewerComponent;
