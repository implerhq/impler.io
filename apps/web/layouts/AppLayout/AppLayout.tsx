import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { PropsWithChildren, useRef } from 'react';
import { Flex, Group, LoadingOverlay, Text, Stack, Title, UnstyledButton, useMantineColorScheme } from '@mantine/core';

import { ActionsEnum, colors, SubjectsEnum, TEXTS } from '@config';
import useStyles from './AppLayout.styles';
import { HomeIcon } from '@assets/icons/Home.icon';
import { LogoutIcon } from '@assets/icons/Logout.icon';
import { ImportIcon } from '@assets/icons/Import.icon';
import { OutLinkIcon } from '@assets/icons/OutLink.icon';
import { SettingsIcon } from '@assets/icons/Settings.icon';
import { ActivitiesIcon } from '@assets/icons/Activities.icon';
import { PeopleIcon } from '@assets/icons/People.icon';
import LogoBlack from '@assets/images/full-logo-dark.png';
import LogoWhite from '@assets/images/full-logo-light.png';

import { useApp } from '@hooks/useApp';
import { NavItem } from '@ui/nav-item';
import { UserMenu } from '@ui/user-menu';
import { track } from '@libs/amplitude';
import { Can } from 'store/ability.context';
import { ColorSchemeToggle } from '@ui/toggle-color-scheme';
import { EditImportIcon } from '@assets/icons/EditImport.icon';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

interface PageProps {
  title?: string;
}

export function AppLayout({ children, pageProps }: PropsWithChildren<{ pageProps: PageProps }>) {
  const router = useRouter();

  const { classes } = useStyles();
  const navRef = useRef<HTMLElement>(null);
  const { colorScheme } = useMantineColorScheme();
  const { profile, logout, isProjectsLoading, isProfileLoading, onEditImportClick } = useApp();

  return (
    <>
      <Head>
        <meta name="og:image" content="/banner.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageProps.title ? `${pageProps.title} | Impler` : 'Impler'}</title>
        <link rel="icon" href={colorScheme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico'} />
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
      </Head>
      <div className={classes.root}>
        <LoadingOverlay visible={isProjectsLoading || isProfileLoading} />
        <aside className={classes.aside}>
          <div className={classes.logoContainer}>
            <Image src={colorScheme === 'dark' ? LogoWhite : LogoBlack} alt="Impler Logo" width={140} />
          </div>

          <UnstyledButton
            onClick={onEditImportClick}
            style={{
              width: '100%',
              border: `1px solid ${colors.StrokeLight}`,
              padding: '8px 12px',
            }}
          >
            <Group position="apart">
              <Text>{profile?.projectName}</Text>
              <EditImportIcon />
            </Group>
          </UnstyledButton>

          <Stack spacing="sm" py="xs">
            <NavItem active={router.pathname === '/'} href="/" icon={<HomeIcon size="lg" />} title="Home" />

            <NavItem
              active={router.pathname.includes('/imports')}
              href="/imports"
              icon={<ImportIcon size="lg" />}
              title="Imports"
            />

            <NavItem
              active={router.pathname.includes('/activities')}
              href="/activities"
              icon={<ActivitiesIcon size="lg" />}
              title="Activities"
            />
            <NavItem
              active={router.pathname.includes('/settings')}
              href="/settings"
              icon={<SettingsIcon size="lg" />}
              title="Settings"
            />
            <Can I={ActionsEnum.READ} a={SubjectsEnum.TEAM_MEMBERS}>
              <NavItem
                active={router.pathname.includes('/team-members')}
                href="/team-members"
                icon={<PeopleIcon size="lg" />}
                title="Team Members"
              />
            </Can>
            <NavItem
              target="_blank"
              title="Documentation"
              href="https://docs.impler.io"
              icon={<OutLinkIcon size="lg" />}
            />
          </Stack>
        </aside>
        <main className={classes.main}>
          <nav ref={navRef}>
            {profile && (
              <Flex justify="space-between">
                <Title order={2}>
                  Welcome, {profile.firstName} {profile.lastName}
                </Title>
                <Group>
                  <ColorSchemeToggle onChange={(theme) => track({ name: 'TOGGLE THEME', properties: { theme } })} />
                  <UserMenu
                    user={{
                      name: `${profile.firstName} ${profile.lastName}`,
                      email: profile.email,
                      image: profile.profilePicture,
                    }}
                    menus={[
                      {
                        title: 'Logout',
                        icon: <LogoutIcon />,
                        onClick: logout,
                      },
                    ]}
                  />
                </Group>
              </Flex>
            )}
          </nav>
          <div className={classes.content}>
            <div className={classes.contentBox}>{children}</div>
          </div>
        </main>
      </div>
      <Support profile={profile} />
    </>
  );
}
