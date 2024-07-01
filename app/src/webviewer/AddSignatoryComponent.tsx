import React, { useState } from "react";

function AddSignatoryComponent() {
  const [email, setEmail] = useState("");
  const [signatories, setSignatories] = useState<string[]>([]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSignatories([...signatories, email]);
    console.log("Signatory added with email:", email);
    setEmail("");
  };

  return (
    <div className="signatories">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          className="primary-button"
          type="submit"
          style={{ backgroundColor: "#fffff" }}
        >
          Add Signatory
        </button>
      </form>

      {signatories.length > 0 && <h2>Liste des signataires :</h2>}
      <ul>
        {signatories.map((signatory, index) => (
          <li key={index}>{signatory}</li>
        ))}
      </ul>
    </div>
  );
}

export default AddSignatoryComponent;
