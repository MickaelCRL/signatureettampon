import { Prisma } from "@prisma/client";

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

export const getUserDocument = async (email: string) => {
  const res = await fetch(`/api/db/userDocument?email=${email}`);

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
