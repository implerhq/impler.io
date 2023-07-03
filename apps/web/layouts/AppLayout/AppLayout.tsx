import Head from 'next/head';
import Image from 'next/image';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { PropsWithChildren, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { Flex, Group, LoadingOverlay, Select, Stack, Title, useMantineColorScheme } from '@mantine/core';

import { ImportIcon } from '@assets/icons/Import.icon';
import { ActivitiesIcon } from '@assets/icons/Activities.icon';
import useStyles from './AppLayout.styles';
import LogoBlack from '@assets/images/full-logo-dark.png';
import LogoWhite from '@assets/images/full-logo-light.png';
import { LogoutIcon } from '@assets/icons/Logout.icon';

import { CONSTANTS } from '@config';
import { useApp } from '@hooks/useApp';
import { NavItem } from '@ui/nav-item';
import { UserMenu } from '@ui/user-menu';
import { track } from '@libs/amplitude';
import { ColorSchemeToggle } from '@ui/toggle-color-scheme';
import { SettingsIcon } from '@assets/icons/Settings.icon';

const { publicRuntimeConfig } = getConfig();

interface PageProps {
  title?: string;
}

export function AppLayout({ children, pageProps }: PropsWithChildren<{ pageProps: PageProps }>) {
  const router = useRouter();
  const twakRef = useRef<any>();
  const { classes } = useStyles();
  const navRef = useRef<HTMLElement>(null);
  const { colorScheme } = useMantineColorScheme();
  const { profile, projects, createProject, logout, setProjectId, isProjectsLoading } = useApp();

  return (
    <>
      <Head>
        <title>{pageProps.title ? `${pageProps.title} | Impler` : 'Impler'}</title>
        <meta
          name="description"
          content="Impler is open-source data import infrastructure, built for engineering teams to help them build rich data import experience without constantly reinventing the wheel."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={colorScheme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico'} />
      </Head>
      <div className={classes.root}>
        <LoadingOverlay visible={isProjectsLoading} />
        <aside className={classes.aside}>
          <div className={classes.logoContainer}>
            <Image src={colorScheme === 'dark' ? LogoWhite : LogoBlack} alt="Impler Logo" width={140} />
          </div>
          <Select
            data={projects?.map((project) => ({ label: project.name, value: project._id })) || []}
            placeholder="Select Project"
            nothingFound="No projects found"
            searchable
            creatable
            pl="sm"
            radius={0}
            value={profile?._projectId}
            getCreateLabel={(query) => `+ Create "${query}"`}
            onChange={(value: string) => setProjectId(value)}
            onCreate={(value: string) => {
              createProject({ name: value });

              return { value, label: value };
            }}
          />
          <Stack spacing="sm" py="xs">
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
          </Stack>
        </aside>
        <main className={classes.main}>
          <nav className={classes.nav} ref={navRef}>
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
      {publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID && publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID ? (
        <TawkMessengerReact
          propertyId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID}
          widgetId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID}
          ref={twakRef}
          onLoad={() => {
            if (typeof window !== 'undefined' && localStorage.getItem(CONSTANTS.PROFILE_STORAGE_NAME)) {
              const user = JSON.parse(localStorage.getItem(CONSTANTS.PROFILE_STORAGE_NAME)!);
              twakRef.current?.setAttributes({
                id: user._id,
                name: user.firstName,
                email: user.email,
              });
            }
          }}
        />
      ) : null}
    </>
  );
}
