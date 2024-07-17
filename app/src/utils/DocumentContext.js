import React, { createContext, useState, useEffect } from "react";

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [document, setDocument] = useState("");
  useEffect(() => {
    setDocument(localStorage.getItem("document") ?? "");
  }, []);

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext;
