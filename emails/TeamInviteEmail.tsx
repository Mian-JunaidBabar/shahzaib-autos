import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface TeamInviteEmailProps {
  inviteLink: string;
  adminName?: string;
}

export const TeamInviteEmail = ({
  inviteLink,
  adminName = "Admin",
}: TeamInviteEmailProps) => {
  const previewText = "You've been invited to Shahzaib Autos Admin";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 max-w-116.25">
            <Heading className="text-black text-[24px] font-bold text-center p-0 my-7.5 mx-0">
              Welcome to <strong>Shahzaib Autos</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-6">
              Hello {adminName},
            </Text>
            <Text className="text-black text-[14px] leading-6">
              You have been invited as an Admin to the Shahzaib Autos Admin
              Panel. Click the button below to set your password and access the
              dashboard.
            </Text>
            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-black rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Accept Invite
              </Button>
            </Section>
            <Text className="text-black text-[12px] leading-5">
              Or copy this link into your browser:
            </Text>
            <Link
              href={inviteLink}
              className="text-blue-600 text-[11px] break-all"
            >
              {inviteLink}
            </Link>
            <Hr className="border border-solid border-[#eaeaea] my-6.5 mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-6.5">
              This invite link expires in 24 hours. If you have questions,
              contact the system administrator.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TeamInviteEmail;
