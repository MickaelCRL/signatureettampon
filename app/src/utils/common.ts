import { Prisma } from "@prisma/client";
import { Magic } from "./types";
import { Dispatch, SetStateAction } from "react";

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
  const res = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
};

export const getUserFromPrisma = async (email: string) => {
  const res = await fetch(`/api/user?email=${email}`);

  if (!res.ok) {
    if (res.status === 404) {
      // Retourne null si l'utilisateur n'existe pas (404)
      return null;
    }
    const error = new Error(res.statusText) as any;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const createEnvelope = async (email: string) => {
  try {
    const response = await fetch("/api/envelope", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create envelope");
    }

    return data;
  } catch (error) {
    console.error("Failed to create envelope:", error);
    throw error;
  }
};
