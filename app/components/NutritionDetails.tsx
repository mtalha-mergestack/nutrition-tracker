import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import axios from "axios";

type Nutrition = {
  [key in keyof string]: string;
};

interface IResponseData {
  message?: string;
  error?: string;
  data?: Nutrition;
}

function NutritionDetails() {
  const [nutritionDetails, setNutritionDetails] = useState<Nutrition | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleImageUpload = async (image: File) => {
    try {
      debugger;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64_image = reader.result;
        const formData = new FormData();
        formData.append("image", base64_image as string);
        const response = await axios.post("/api/openai", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        debugger;
        const { message, data, error } = response.data as IResponseData;
        if (error) {
          setError(error);
          setNutritionDetails(null);
          setMessage("");
        } else if (message) {
          setNutritionDetails(null);
          setError("");
          setMessage(message);
        } else if (data) {
          setNutritionDetails(data);
          setError("");
          setMessage("");
        }
      };
    } catch (error) {
      console.error("Error extracting nutrition details:", error);
    }
  };
  return (
    <>
      <ImageUploader onImageUpload={handleImageUpload} />
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      {nutritionDetails && (
        <div>
          <h1 className="text-font-large">Nutrition Details</h1>
          <ul className="text-center text-align-right">
            {Object.keys(nutritionDetails).map((key) => (
              <li key={key}>
                {key}: {nutritionDetails[key as keyof Nutrition]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default NutritionDetails;
