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
