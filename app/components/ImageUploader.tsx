"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      onImageUpload(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      {image ? (
        <div style={{ maxWidth: "100%", maxHeight: "300px" }}>
          <p>Uploaded please wait...</p>
        </div>
      ) : (
        <p>Drag `n` drop an image here, or click to select one</p>
      )}
    </div>
  );
};

export default ImageUploader;
