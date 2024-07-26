import { Prisma } from "@prisma/client";

export const createSignatory = async (
  signatory: Prisma.SignatoryCreateInput,
  idDocument: string
) => {
  console.log("createSignatory", { signatory, idDocument });
  const res = await fetch("/api/db/signatory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signatoryData: { ...signatory, idDocument } }),
  });

  if (!res.ok) {
    console.log("Failed to create signatory:", res.statusText);
    console.log("Failed to create signatory:", res);
    throw new Error(res.statusText);
  }

  console.log("test res 201", res);

  return res.json();
};

export const getDocumentByIdForSignatory = async (
  email: string,
  idDocument: string
) => {
  try {
    // Construire l'URL avec les paramètres de la requête
    const response = await fetch(
      `/api/db/signatory?email=${encodeURIComponent(
        email
      )}&idDocument=${encodeURIComponent(idDocument)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Vérifier si la réponse est ok
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    // Extraire et retourner les données de la réponse
    const data = await response.json();
    console.log("Fetched document data:", data);
    return data;
  } catch (error: any) {
    console.error("Error retrieving document:", error);
    throw new Error(`Error: ${error.message}`);
  }
};

export async function updateSignatoryStatus(email: string, hasSigned: boolean) {
  try {
    const res = await fetch("/api/db/signatory", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, hasSigned }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
