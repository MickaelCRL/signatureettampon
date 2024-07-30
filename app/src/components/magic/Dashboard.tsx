import Spacer from "@/components/ui/Spacer";
import { createEnvelope } from "@/utils/prisma/envelope";
import { LoginProps } from "@/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "./Header";

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
    <div className="home-page">
      <Header isLoggedIn={true} token={token} setToken={setToken} />
      <div className="cards-container">
        {/* <UserInfo token={token} setToken={setToken} /> */}
        <Spacer size={10} />
        {/* <WalletMethods token={token} setToken={setToken} /> */}
        <Spacer size={15} />
      </div>

      <>
        <p className="title-center">Signer un document</p>
        <button
          className="btn-primary"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Commencer"}
        </button>
      </>
    </div>
  );
}
