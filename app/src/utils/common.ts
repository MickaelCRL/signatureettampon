import { Prisma, PrismaClient } from "@prisma/client";
import { Magic } from "./types";
import { Dispatch, SetStateAction } from "react";

const prisma = new PrismaClient();

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
