import React, { useEffect, useState } from "react";
import { getUserDocument } from "@/utils/prisma/user";
import { useUserContext } from "@/context/UserContext";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";

const ListeDocument = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [displayedDocumentsCount, setDisplayedDocumentsCount] = useState(5);
  const { user } = useUserContext();
  const email = localStorage.getItem("email") || "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getUserDocument(email);

        // Sort documents by createdAt date
        const sortedDocs = docs.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setDocuments(sortedDocs || []);
      } catch (err) {
        setError("Failed to fetch documents");
      }
    };

    fetchDocuments();
  }, [email]);

  if (error) return <div>Error: {error}</div>;

  const handleDownload = (url: string) => {
    // Logic to download the document
    window.open(url, "_blank");
  };

  const handleShowMore = () => {
    setDisplayedDocumentsCount((prevCount) => prevCount + 5);
  };

  return (
    <section>
      <div className="container-section">
        <p>Activité de l'accord</p>
        <List>
          {documents.slice(0, displayedDocumentsCount).map((doc) => (
            <ListItem
              key={doc.idDocument}
              sx={{
                marginBottom: 2,
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <ListItemText
                primary={doc.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {doc.isSigned ? "Complété" : "En cours"}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: "block" }}
                    >
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ fontWeight: "bold" }}
                secondaryTypographyProps={{
                  color: doc.isSigned ? "green" : "orange",
                }}
              />
              {doc.isSigned && (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<Download />}
                  onClick={() => handleDownload(doc.url)}
                >
                  Télécharger
                </Button>
              )}
            </ListItem>
          ))}
        </List>
        {displayedDocumentsCount < documents.length && (
          <Button variant="contained" onClick={handleShowMore}>
            Voir plus
          </Button>
        )}
      </div>
    </section>
  );
};

export default ListeDocument;
