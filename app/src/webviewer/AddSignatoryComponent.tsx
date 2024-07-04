import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import FormInput from "@/components/ui/FormInput";

function AddSignatoryComponent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [signatories, setSignatories] = useState<Signatory[]>([]);

  useEffect(() => {
    const storedSignatories = localStorage.getItem("signatories");
    if (storedSignatories) {
      setSignatories(JSON.parse(storedSignatories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("signatories", JSON.stringify(signatories));
  }, [signatories]);

  const handleSubmit = async () => {
    let valid = true;

    if (firstName.trim() === "") {
      setFirstNameError(true);
      valid = false;
    }

    if (lastName.trim() === "") {
      setLastNameError(true);
      valid = false;
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
    console.log("Signatory added with email:", email);
    setSignatories([...signatories, { firstName, lastName, email }]);
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  const handleRemoveSignatory = (index: number) => {
    setSignatories(signatories.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card>
        <CardHeader id="addSignatory">Ajouter des signataires</CardHeader>
        <div className="signatories"></div>
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
        {lastNameError && <span className="error">Last name is required</span>}
        <FormInput
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
          value={email}
          placeholder={"Email"}
        />
        {emailError && <span className="error">Enter a valid email</span>}
        <button className="login-button" onClick={() => handleSubmit()}>
          Ajouter
        </button>
      </Card>

      {signatories.length > 0 && (
        <Card>
          <CardHeader id="signatories">Liste des signataires</CardHeader>
          <ul>
            {signatories.map((signatory, index) => (
              <li key={index}>
                {signatory.firstName} {signatory.lastName}
                <button
                  className="login-button"
                  onClick={() => handleRemoveSignatory(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

export default AddSignatoryComponent;
