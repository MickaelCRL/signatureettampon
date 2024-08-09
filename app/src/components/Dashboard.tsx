import Spacer from "@/components/ui/Spacer";
import { createEnvelope } from "@/utils/prisma/envelope";
import { LoginProps } from "@/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import ListeDocument from "./user/document/ListeDocument";
import HeaderTransparent from "./HeaderTransparent";
import Hero from "./Hero";

export default function Dashboard({ token, setToken }: LoginProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const email = localStorage.getItem("email");
    try {
      if (!email) {
        throw new Error("Email not found in localStorage");
      }

      const data = await createEnvelope(email);
      console.log(data.message);
    } catch (error) {
      console.error("Failed to check or create envelope:", error);
    } finally {
      setLoading(false);
    }

    router.push("/upload-file");
  };

  return (
    <>
      <Hero></Hero>

      <section style={{ marginTop: "100vh" }}>
        <div className="container-section">
          {" "}
          <p className="title-center">Signer un document</p>
        </div>
      </section>

      <ListeDocument />
    </>
  );
}
