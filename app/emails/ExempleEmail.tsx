import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ExempleEmailProps {
  documentUrl?: string;
}

export const ExempleEmail: React.FC<Readonly<ExempleEmailProps>> = ({
  documentUrl,
}) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link.</Preview>
    <Body className="bg-white font-sans">
      <Container
        className="mx-auto p-5 bg-bottom bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/raycast-bg.png")' }}
      >
        <Img
        //   src={`${baseUrl}/static/raycast-logo.png`}
        //   width={48}
        //   height={48}
        //   alt="Raycast"
        />
        <Heading className="text-2xl font-bold mt-12">
          🪄 Your magic link
        </Heading>
        <Section className="my-6">
          <Text className="text-base leading-7">
            <Link className="text-red-500" href={documentUrl}>
              👉 Click here to sign in 👈
            </Link>
          </Text>
          <Text className="text-base leading-7">
            If you didn't request this, please ignore this email.
          </Text>
        </Section>
        <Text className="text-base leading-7">
          Best,
          <br />- Raycast Team
        </Text>
        <Hr className="border-t border-gray-300 mt-12" />
        <Img
        //   src={`${baseUrl}/static/raycast-logo.png`}
        //   width={32}
        //   height={32}
        //   className="filter grayscale my-5"
        />
        <Text className="text-xs text-gray-500 ml-1">
          Raycast Technologies Inc.
        </Text>
        <Text className="text-xs text-gray-500 ml-1">
          2093 Philadelphia Pike #3222, Claymont, DE 19703
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ExempleEmail;
