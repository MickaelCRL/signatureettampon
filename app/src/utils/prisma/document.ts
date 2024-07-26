import { Prisma } from "@prisma/client";

export const createDocument = async (document: Prisma.DocumentCreateInput) => {
  const res = await fetch("/api/db/document", {
    method: "POST",
    body: JSON.stringify(document),
  });

  if (!res.ok) {
    console.log("Failed to create document:", res.statusText);
    console.log("Failed to create document:", res);
    throw new Error(res.statusText);
  }

  console.log("test res 201", res);

  return res.json();
};

export async function updateDocument(document: Document) {
  try {
    const res = await fetch("/api/db/document", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document }),
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
