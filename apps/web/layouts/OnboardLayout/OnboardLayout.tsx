import { Flex, Paper, Anchor } from '@mantine/core';
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, TEXTS } from '@config';
import { IErrorObject } from '@impler/shared';
import DarkLogo from '@assets/images/logo-dark.png';

import { useAppState } from 'store/app.context';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

type OnboardLayoutProps = PropsWithChildren;

export function OnboardLayout({ children }: OnboardLayoutProps) {
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
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
      </Head>
      <main>
        <Flex direction="column" mih="100vh">
          {/* Header with logo and help links */}
          <Flex p="xs" align="center" justify="space-between">
            <Image src={DarkLogo} width={30} height={35} alt="Impler Logo" />

            <Flex gap="xs" align="center">
              <Link href={CONSTANTS.IMPLER_DOCUMENTATION} passHref legacyBehavior>
                <Anchor component="a" fw={600} c="white" fz="sm">
                  Need Help ?
                </Anchor>
              </Link>

              <Anchor href={CONSTANTS.IMPLER_CAL_QUICK_MEETING} fw={600} c="white" fz="sm">
                Get in Touch
              </Anchor>
            </Flex>
          </Flex>

          <Flex style={{ flexGrow: 1 }} align="center" justify="center">
            <Paper withBorder radius="md" p="lg" w={600} maw="90%">
              {children}
            </Paper>
          </Flex>
        </Flex>
      </main>
      <Support />
    </>
  );
}
