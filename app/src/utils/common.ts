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
  localStorage.setItem("userAddress", "");
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
  localStorage.setItem("userAddress", userAddress);
  localStorage.setItem("email", email);
};

export async function sendDocumentSigned(email: string) {
  try {
    const res = await fetch("/api/resend/documentSigned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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

export async function sendDocumentToSign(email: string, idDocument: string) {
  try {
    const res = await fetch("/api/resend/documentToSign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, idDocument }),
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
