import { useMagic } from "../MagicProvider";
import showToast from "@/utils/showToast";
import Spinner from "../../ui/Spinner";
import { RPCError, RPCErrorCode } from "magic-sdk";
import { LoginProps } from "@/utils/types";
import { saveUserInfo } from "@/utils/common";
import { getUserFromPrisma, saveUserInPrisma } from "@/utils/prisma/user";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import Logo from "/public/images/logo-signatureettampon.png"; // Importer le logo

const theme = createTheme({
  palette: {
    primary: {
      main: "#edc315", // Jaune pour les boutons
    },
    secondary: {
      main: "#c49a2d", // Jaune foncé pour d'autres éléments
    },
    background: {
      default: "#303030", // Fond gris
    },
  },
  typography: {
    fontFamily: ["Poppins", "Oswald", "Montserrat"].join(","),
  },
});

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
  const { user, setUser } = useUserContext();

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

          setUser({
            firstName,
            lastName,
            email,
          });
        } catch (error) {
          if ((error as any).status !== 404) {
            throw error; // Relever l'erreur si ce n'est pas un 404
          }
          // Continuer si c'est un 404, car l'utilisateur n'existe pas, ce qui est attendu
        }
      } else {
        try {
          const res = await getUserFromPrisma(email);
          if (!res) {
            showToast({
              message: "Email not found. Please create an account.",
              type: "error",
            });
            return;
          }

          setFirstName(res.firstName);
          setLastName(res.lastName);

          setUser({
            firstName: res.firstName,
            lastName: res.lastName,
            email,
          });
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
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            backgroundImage: 'url("/images/image-inscription.png")',
            backgroundSize: "cover", // Assure que l'image couvre toute la largeur disponible
            backgroundPosition: "center", // Centre l'image
            backgroundRepeat: "no-repeat", // Évite la répétition de l'image
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image src={Logo} alt="Logo" width={140} height={140} />
            <Typography component="h1" variant="h5">
              Login / Sign Up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {isCreatingAccount && (
                <>
                  <TextField
                    onChange={(e) => {
                      if (firstNameError) setFirstNameError(false);
                      setFirstName(e.target.value);
                    }}
                    placeholder="First Name"
                    value={firstName}
                    error={firstNameError}
                    helperText={firstNameError && "First name is required"}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    onChange={(e) => {
                      if (lastNameError) setLastNameError(false);
                      setLastName(e.target.value);
                    }}
                    placeholder="Last Name"
                    value={lastName}
                    error={lastNameError}
                    helperText={lastNameError && "Last name is required"}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              <TextField
                onChange={(e) => {
                  if (emailError) setEmailError(false);
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                value={email}
                error={emailError}
                helperText={emailError && "Enter a valid email"}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                disabled={isLoginInProgress || email.length === 0}
                onClick={handleLogin}
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoginInProgress ? (
                  <Spinner />
                ) : isCreatingAccount ? (
                  "Sign Up"
                ) : (
                  "Log In"
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    onClick={() => setIsCreatingAccount(false)}
                    variant="text"
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => setIsCreatingAccount(true)}
                    variant="text"
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default EmailOTP;
