import React, { useContext, useState } from "react";
import HeaderTransparent from "./HeaderTransparent";
import TokenContext from "@/utils/TokenContext";
import { useRouter } from "next/router";

function Hero() {
  const { token, setToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      router.push("/upload-file");
    } catch (error) {
      console.error("Failed to handle click:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-image">
      <HeaderTransparent isLoggedIn={true} token={token} setToken={setToken} />

      <section
        style={{
          marginTop: "40vh",
        }}
      >
        <div className="container-section hero-content">
          <h1>Bienvenue sur notre plateforme</h1>
          <p>Votre solution pour signer des documents en ligne</p>
          <button
            className="btn-primary"
            onClick={handleClick}
            disabled={loading}
            style={{
              marginTop: "20px",
            }}
          >
            {loading ? "Chargement..." : "Signer un document"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Hero;
