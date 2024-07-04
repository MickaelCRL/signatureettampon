import Header from "@/components/magic/Header";
import MagicProvider from "@/components/magic/MagicProvider";
import Spacer from "@/components/ui/Spacer";
import TokenContext from "@/utils/TokenContext";
import { useRouter } from "next/router";
import React, { useContext } from "react";

function SigningComplete() {
  const { token, setToken } = useContext(TokenContext);
  const router = useRouter();
  const { documentName } = router.query;

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <>
      <MagicProvider>
        <Header isLoggedIn={true} token={token} setToken={setToken} />
        <Spacer size={30} />
        <div>
          <h1>Félicitations, vous avez terminé de signer votre document!</h1>
          {documentName && (
            <p>Document: {decodeURIComponent(documentName as string)}</p>
          )}
          <button className="login-button" onClick={handleGoHome}>
            Retour à l'accueil
          </button>
        </div>
      </MagicProvider>
    </>
  );
}

export default SigningComplete;
