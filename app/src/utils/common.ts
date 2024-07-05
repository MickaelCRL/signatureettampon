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
  userAddress: string
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("isAuthLoading", "false");
  localStorage.setItem("loginMethod", loginMethod);
  localStorage.setItem("user", userAddress);
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
