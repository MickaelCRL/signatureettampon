import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { EmailTemplate } from "../../../../emails/EmailTemplate";
import { render } from "@react-email/components";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, idDocument } = req.body;
    const url = `http://localhost:3000/invitation/login?idDocument=${idDocument}`;
    try {
      const { data, error } = await resend.emails.send({
        from: "contact@signatureettampon.com",
        to: email,
        subject: "Invitation document à signer",
        html: `<!DOCTYPE html>
              <html lang="fr">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invitation à signer un document</title>
              </head>
              <body style="background-color: #ffffff; font-family: sans-serif;">
                <div style="margin: auto; padding: 20px;">
                  <h2 style="font-size: 2rem; font-weight: bold; margin-top: 12px;">Invitation à signer un document</h2>
                  <section style="margin-top: 24px;">
                    <p style="font-size: 1.125rem; line-height: 1.5;">
                      Bonjour,
                    </p>
                    <p style="font-size: 1.125rem; line-height: 1.5;">
                      Vous êtes invité(e) à signer le document suivant :
                    </p>
                    <p style="font-size: 1.125rem; line-height: 1.5;">
                      <a href="${url}" style="color: #ff0000; text-decoration: none; border: 1px solid #ff0000; padding: 10px; border-radius: 5px;">Signer le document</a>
                    </p>
                    <p style="font-size: 1.125rem; line-height: 1.5;">
                      Veuillez cliquer sur le lien ci-dessus pour accéder au document et le signer électroniquement.
                    </p>
                  </section>
                  <p style="font-size: 1.125rem; line-height: 1.5;">
                    Meilleures salutations,
                    <br>
                    - L'équipe Signature et Tampon
                  </p>
                  <hr style="border-top: 1px solid #cccccc; margin-top: 24px;">
                  <p style="font-size: 0.75rem; color: #888888; margin-left: 4px;">Signature et Tampon</p>
                  <p style="font-size: 0.75rem; color: #888888; margin-left: 4px;">Parvis Alan Turing, Paris, France</p>
                </div>
              </body>
              </html>`,
      });

      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json({ message: "Email sent successfully!", data });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
