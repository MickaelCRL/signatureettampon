import React, { useCallback, useState } from "react";
import { logout } from "@/utils/common";
import { LoginProps } from "@/utils/types";
import { useMagic } from "../MagicProvider";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/router";

const Disconnect = ({ setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const disconnect = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      await logout(setToken, magic);
      setDisabled(false);
      router.push("/");
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic, setToken]);

  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <div className="wallet-method-container">
      <button
        className="wallet-method"
        onClick={disconnect}
        disabled={disabled}
      >
        {disabled ? (
          <div className="loading-container w-[115px]">
            <Spinner />
          </div>
        ) : (
          "Se déconnecter"
        )}
      </button>
      {/* <div className="wallet-method-desc">Disconnects user from dApp.</div> */}
    </div>
  );
};

export default Disconnect;
