import { Flex, Anchor, Box, createStyles, keyframes } from '@mantine/core';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, colors, CONSTANTS, TEXTS } from '@config';
import { IErrorObject } from '@impler/shared';
import DarkLogo from '@assets/images/logo-dark.png';

import { LeftSideContent } from './LeftSideContent';

import { useAppState } from 'store/app.context';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

const subtleGradientShift = keyframes({
  '0%, 100%': {
    backgroundPosition: '0% 50%',
  },
  '50%': {
    backgroundPosition: '100% 50%',
  },
});

const softGlow = keyframes({
  '0%, 100%': {
    opacity: 0.15,
  },
  '50%': {
    opacity: 0.25,
  },
});

const useStyles = createStyles((theme) => ({
  splitContainer: {
    minHeight: '100vh',
    position: 'relative',
    [theme.fn.largerThan('md')]: {
      display: 'grid',
      gridTemplateColumns: '60% 40%',
    },
  },
  leftSide: {
    display: 'none',
    position: 'relative',
    overflow: 'hidden',
    [theme.fn.largerThan('md')]: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing.xl,
      background:
        'linear-gradient(135deg, #6B4423 0%, #4A2C42 20%, #2D2F5A 40%, #1A2847 60%, #0F1B3D 80%, #0A0F2C 100%)',
      backgroundSize: '200% 200%',
      animation: `${subtleGradientShift} 20s ease-in-out infinite`,
      color: 'white',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(255, 193, 7, 0.08) 0%, transparent 50%)',
      animation: `${softGlow} 8s ease-in-out infinite`,
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 80% 50%, rgba(0, 188, 212, 0.12) 0%, transparent 50%)',
      animation: `${softGlow} 10s ease-in-out infinite reverse`,
      pointerEvents: 'none',
    },
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.xl,
    [theme.fn.largerThan('md')]: {
      padding: theme.spacing.xl,
    },
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xs,
    position: 'relative',
    zIndex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '100%',
    position: 'relative',
    zIndex: 1,
    [theme.fn.largerThan('sm')]: {
      maxWidth: '400px',
      margin: '0 auto',
    },
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
  },
}));

type OnboardLayoutProps = PropsWithChildren;

export function OnboardLayout({ children }: OnboardLayoutProps) {
  const { classes } = useStyles();
  const { setProfileInfo } = useAppState();

  useQuery<unknown, IErrorObject, IProfileData, [string]>(
    [API_KEYS.ME],
    () => commonApi<IProfileData>(API_KEYS.ME as any, {}),
    {
      onSuccess(profileData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.usetifulTags = { userId: profileData?._id };
        setProfileInfo(profileData);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Get started | Impler</title>
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
      </Head>
      <main className={classes.splitContainer}>
        {/* Left side with gradient background */}
        <div className={classes.leftSide}>
          <LeftSideContent />
        </div>

        <div className={classes.rightSide}>
          <Box className={classes.logoContainer}>
            <Image src={DarkLogo} width={30} height={35} alt="Impler Logo" />
            <Flex gap="xs" align="center">
              <Link href={CONSTANTS.IMPLER_DOCUMENTATION} passHref legacyBehavior>
                <Anchor underline={false} component="a" fw={600} c="dimmed" fz="sm">
                  Need Help?
                </Anchor>
              </Link>
              <Anchor underline={false} href={CONSTANTS.IMPLER_CAL_QUICK_MEETING} fw={600} c={colors.blue[6]} fz="sm">
                Get in Touch
              </Anchor>
            </Flex>
          </Box>

          <Box className={classes.content}>
            {/* <Paper withBorder radius="md" p="lg" w="100%"> */}
            {children}
            {/* </Paper> */}
          </Box>
        </div>
      </main>
      <Support />
    </>
  );
}
