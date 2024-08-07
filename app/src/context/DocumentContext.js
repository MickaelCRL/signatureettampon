import { createContext, useContext, useState, useEffect } from "react";

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [document, setDocumentState] = useState(null);

  useEffect(() => {
    console.log("Dans le contexte document");
    const storedDocument = sessionStorage.getItem("document");
    console.log("storedDocument", storedDocument);
    if (storedDocument) {
      setDocument(JSON.parse(storedDocument));
    }
  }, []);

  const setDocument = (doc) => {
    setDocumentState(doc);
    sessionStorage.setItem("document", JSON.stringify(doc));
  };

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => useContext(DocumentContext);
