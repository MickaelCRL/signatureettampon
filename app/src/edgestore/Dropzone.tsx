"use client";
import * as React from "react";
import { useEdgeStore } from "../lib/edgestore";
import { useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export default function Dropzone() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const { document, setDocument } = useDocumentContext();

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
          console.log(progress);
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
    <div className="flex flex-col items-center m-6 gap-2">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        className="btn-primary px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300"
        style={{ marginBottom: "10px" }}
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full mt-4">
          <div
            className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}
