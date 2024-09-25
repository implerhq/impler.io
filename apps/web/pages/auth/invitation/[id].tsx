import Link from 'next/link';
import { Text, Group, Container, Title, Stack } from '@mantine/core';

import { ROUTES } from '@config';
import { Button } from '@ui/button';
import { formatUrl } from '@shared/helpers';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { useInvitation, ModesEnum } from '@hooks/useInvitation';

export default function InvitationPage() {
  const {
    mode,
    invitationData,
    logout,
    isLoggedInUser,
    acceptInvitation,
    isAcceptInvitationLoading,
    declineInvitation,
    isDeclineInvitationLoading,
    invitationId,
  } = useInvitation();

  const handlePrimaryAction = () => {
    if (mode === ModesEnum.ACCEPT) acceptInvitation();
    else logout();
  };

  return !isLoggedInUser ? (
    <Container size="md" p="md">
      <Stack spacing="md" align="left">
        <Title>
          <Group position="left">Sign Up or Sign In</Group>
        </Title>
        <Text size="md" color="dimmed" align="left">
          You have to signin or create new account to take action on the invitation you&apos;ve received.
        </Text>
        <Link href={formatUrl(ROUTES.SIGNUP, [], { invitationId })}>
          <Button fullWidth size="md">
            Sign Up
          </Button>
        </Link>
        <Text size="md" align="center">
          Already have an account? <Link href={formatUrl(ROUTES.SIGNIN, [], { invitationId })}>Sign In</Link>
        </Text>
      </Stack>
    </Container>
  ) : (
    <>
      <Container size="md" p="md">
        <Stack spacing="md" align="left">
          <Title>
            <Group position="left">{mode === ModesEnum.ACCEPT ? 'Accept Invitation' : 'Active Session'}</Group>
          </Title>
          <Text size="sm">
            {mode === ModesEnum.ACCEPT ? (
              <>
                You have been Invited by <b>{invitationData?.invitedBy}</b> to join <b>{invitationData?.projectName}</b>
                .
              </>
            ) : (
              <>Invitation link is invalid, expired or not belongs to you. Please login with right user if needed.</>
            )}
          </Text>
          <Button fullWidth size="md" onClick={handlePrimaryAction} loading={isAcceptInvitationLoading}>
            {mode === ModesEnum.ACCEPT ? 'Accept Invitation' : 'Logout'}
          </Button>
          <Text size="md" align="center">
            {mode === ModesEnum.ACCEPT ? (
              <Button
                fullWidth
                variant="outline"
                loading={isDeclineInvitationLoading}
                onClick={() => declineInvitation()}
              >
                Decline Invitation
              </Button>
            ) : (
              <>
                Go to <Link href={ROUTES.HOME}>Homepage</Link>
              </>
            )}
          </Text>
        </Stack>
      </Container>
    </>
  );
}

InvitationPage.Layout = OnboardLayout;
