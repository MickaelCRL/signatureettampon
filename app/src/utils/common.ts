import { Prisma } from "@prisma/client";
import { Magic } from "./types";
import { Dispatch, SetStateAction } from "react";
import prisma from "@/lib/prisma";

export type LoginMethod = "EMAIL" | "SMS" | "SOCIAL" | "FORM";

export const logout = async (
  setToken: Dispatch<SetStateAction<string>>,
  magic: Magic | null
) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
  localStorage.setItem("token", "");
  localStorage.setItem("user", "");
  setToken("");
};

export const saveUserInfo = (
  token: string,
  loginMethod: LoginMethod,
  userAddress: string,
  email: string
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("isAuthLoading", "false");
  localStorage.setItem("loginMethod", loginMethod);
  localStorage.setItem("user", userAddress);
  localStorage.setItem("email", email);
};

export const saveUserInPrisma = async (user: Prisma.UserCreateInput) => {
  const res = await fetch("/api/db/user", {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
};

export const getUserFromPrisma = async (email: string) => {
  const res = await fetch(`/api/db/user?email=${email}`);

  if (!res.ok) {
    if (res.status === 404) {
      // Return null if user does not exist (404)
      return null;
    }
    const error = new Error(res.statusText) as any;
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data;
};

export const createEnvelope = async (email: string) => {
  try {
    const res = await fetch("/api/db/envelope", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create envelope");
    }

    return data;
  } catch (error) {
    console.error("Failed to create envelope:", error);
    throw error;
  }
};

export const getUserEnvelope = async (email: string) => {
  try {
    const res = await fetch(
      `/api/db/envelope?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to get envelope");
    }

    return data;
  } catch (error) {
    console.error("Failed to get envelope:", error);
    throw error;
  }
};

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

export async function signDocument(idDocument: string, isSigned: boolean) {
  try {
    const res = await fetch("/api/db/document", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idDocument, isSigned }),
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

export async function sendDocumentSigned(email: string, documentUrl: string) {
  try {
    const res = await fetch("/api/resend/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, documentUrl }),
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
