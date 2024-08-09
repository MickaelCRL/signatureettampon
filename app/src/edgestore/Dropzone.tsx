"use client";
import * as React from "react";
import { useState } from "react";
import { useEdgeStore } from "../lib/edgestore";
import { useDocumentContext } from "@/context/DocumentContext";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Dropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const { document, setDocument } = useDocumentContext();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      setUploading(false);
      // Pass the document information to the context
      setDocument({
        name: file.name,
        url: res.url,
        hash: "",
        isSigned: false,
      });

      console.log(res);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 2,
        border: "2px dashed #c49a2d", // Couleur de la bordure en accord avec votre thème
        borderRadius: 2,
        bgcolor: "#fff", // Couleur de fond pour un contraste net
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        mb: 4,
        position: "relative", // Position relative pour le conteneur
        minHeight: 300,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <IconButton
        color="primary"
        component="label"
        sx={{
          bgcolor: "#fff",
          borderRadius: "50%",
          p: 2,
          boxShadow: 3,
          "&:hover": {
            bgcolor: "#f1f1f1",
          },
          marginTop: "10px",
        }}
      >
        <InsertDriveFileIcon
          sx={{ fontSize: 40, color: "#000" }} // Icône noire
        />
        <input type="file" hidden onChange={handleFileSelect} />
      </IconButton>
      <Typography variant="body1" gutterBottom color="#000">
        {file
          ? `Selected file: ${file.name}`
          : "Drag and drop or click to select a file"}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon sx={{ color: "#000" }} />}
        onClick={handleUpload}
        disabled={uploading || !file}
        sx={{
          mt: 1,
          bgcolor: "#c49a2d", // Couleur de fond du bouton
          color: "#000", // Couleur du texte du bouton
          "&:hover": {
            bgcolor: "#edc315", // Couleur du bouton au survol
            color: "#000", // Couleur du texte au survol
          },
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {uploading && (
        <Box
          sx={{
            width: "100%",
            mt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            sx={{
              color: "#000", // Couleur de la barre de progression
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
