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
} from "@react-email/components";
import * as React from "react";

interface TeamInviteEmailProps {
  inviteLink: string;
  adminName?: string;
}

export const TeamInviteEmail = ({
  inviteLink,
  adminName = "An administrator",
}: TeamInviteEmailProps) => {
  const previewText = `You have been invited to join the Shahzaib Autos Team.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>Shahzaib Autos</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {adminName} has invited you to join the Shahzaib Autos Admin Panel
              as a team member.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Accept Invite & Set Password
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <a href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TeamInviteEmail;
