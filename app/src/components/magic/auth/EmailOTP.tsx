import { useMagic } from "../MagicProvider";
import showToast from "@/utils/showToast";
import Spinner from "../../ui/Spinner";
import { RPCError, RPCErrorCode } from "magic-sdk";
import { LoginProps } from "@/utils/types";
import { saveUserInfo } from "@/utils/common";
import { getUserFromPrisma, saveUserInPrisma } from "@/utils/prisma/user";
import Card from "../../ui/Card";
import CardHeader from "../../ui/CardHeader";
import { useState } from "react";
import FormInput from "@/components/ui/FormInput";

const EmailOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleLogin = async () => {
    let valid = true;

    // Reset errors
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);

    if (isCreatingAccount) {
      if (firstName.trim() === "") {
        setFirstNameError(true);
        valid = false;
      }

      if (lastName.trim() === "") {
        setLastNameError(true);
        valid = false;
      }
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setEmailError(true);
      valid = false;
    }

    if (!valid) return;

    try {
      setLoginInProgress(true);

      if (isCreatingAccount) {
        try {
          const existingUser = await getUserFromPrisma(email);
          if (existingUser) {
            showToast({
              message: "Email already exists. Please log in.",
              type: "error",
            });
            return;
          }
        } catch (error) {
          if ((error as any).status !== 404) {
            throw error; // Relever l'erreur si ce n'est pas un 404
          }
          // Continuer si c'est un 404, car l'utilisateur n'existe pas, ce qui est attendu
        }
      } else {
        try {
          const user = await getUserFromPrisma(email);
          if (!user) {
            showToast({
              message: "Email not found. Please create an account.",
              type: "error",
            });
            return;
          }
        } catch (error) {
          if ((error as any).status === 404) {
            showToast({
              message: "Email not found. Please create an account.",
              type: "error",
            });
            return;
          } else {
            throw error;
          }
        }
      }

      const token = await magic?.auth.loginWithEmailOTP({ email });
      if (!token) {
        throw new Error("Magic login failed");
      }

      const metadata = await magic?.user.getMetadata();
      if (!metadata?.publicAddress) {
        throw new Error("Magic login failed");
      }

      setToken(token);
      saveUserInfo(token, "EMAIL", metadata.publicAddress, email);

      if (isCreatingAccount) {
        await saveUserInPrisma({ firstName, lastName, email });
      }

      // Reset form fields
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (e) {
      console.error("login error:", e);
      if (e instanceof RPCError) {
        switch (e.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            showToast({ message: e.message, type: "error" });
            break;
          default:
            showToast({
              message: "Something went wrong. Please try again",
              type: "error",
            });
        }
      } else {
        showToast({
          message: "Something went wrong. Please try again",
          type: "error",
        });
      }
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <Card>
      <CardHeader id="login">Login / Sign Up</CardHeader>
      <div className="login-method-grid-item-container">
        {isCreatingAccount && (
          <>
            <FormInput
              onChange={(e) => {
                if (firstNameError) setFirstNameError(false);
                setFirstName(e.target.value);
              }}
              placeholder="First Name"
              value={firstName}
            />
            {firstNameError && (
              <span className="error">First name is required</span>
            )}
            <FormInput
              onChange={(e) => {
                if (lastNameError) setLastNameError(false);
                setLastName(e.target.value);
              }}
              placeholder="Last Name"
              value={lastName}
            />
            {lastNameError && (
              <span className="error">Last name is required</span>
            )}
          </>
        )}
        <FormInput
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
          placeholder="Email"
          value={email}
        />
        {emailError && <span className="error">Enter a valid email</span>}
        <button
          className="login-button"
          disabled={isLoginInProgress || email.length === 0}
          onClick={handleLogin}
        >
          {isLoginInProgress ? (
            <Spinner />
          ) : isCreatingAccount ? (
            "Sign Up"
          ) : (
            "Log In"
          )}
        </button>
        <div>
          {isCreatingAccount ? (
            <p>
              J'ai déjà un compte{" "}
              <button
                className="toggle-button"
                onClick={() => setIsCreatingAccount(false)}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Créer un compte{" "}
              <button
                className="toggle-button"
                onClick={() => setIsCreatingAccount(true)}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmailOTP;
