import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PropsWithChildren, useRef } from 'react';
import { Divider, Flex, Group, LoadingOverlay, Stack, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import DarkLogo from '@assets/images/logo-dark.png';
import { ActionsEnum, colors, CONSTANTS, ROUTES, SubjectsEnum, TEXTS } from '@config';
import { HomeIcon } from '@assets/icons/Home.icon';
import { PeopleIcon } from '@assets/icons/People.icon';
import { LogoutIcon } from '@assets/icons/Logout.icon';
import { ImportIcon } from '@assets/icons/Import.icon';
import { OutLinkIcon } from '@assets/icons/OutLink.icon';
import LogoWhite from '@assets/images/full-logo-light.png';
import { SettingsIcon } from '@assets/icons/Settings.icon';
import { ActivitiesIcon } from '@assets/icons/Activities.icon';
import { EditProjectIcon } from '@assets/icons/EditImport.icon';

import { NavItem } from '@ui/nav-item';
import { UserMenu } from '@ui/user-menu';
import { Can } from 'store/ability.context';
import { useProject } from '@hooks/useProject';
import { useAppState } from 'store/app.context';
import { useLogout } from '@hooks/auth/useLogout';
import { notify } from '@libs/notify';
import { usePlanDetails } from '@hooks/usePlanDetails';
import dynamic from 'next/dynamic';
import { useStyles } from './AppLayout.styles';
import { DrawerRightOpenIcon } from '@assets/icons/DrawerRightOpen.icon';
import { DrawerLeftCloseIcon } from '@assets/icons/DrawerLeftClose.icon';

import { useClipboard, useLocalStorage } from '@mantine/hooks';
import { EmailIcon } from '@assets/icons/Email.icon';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

interface PageProps {
  title?: string;
}

export function AppLayout({ children, pageProps }: PropsWithChildren<{ pageProps: PageProps }>) {
  const [collapsed, setCollapsed] = useLocalStorage({
    key: CONSTANTS.SIDEBAR_COLLAPSED_KEY,
    defaultValue: false,
  });
  const { copy } = useClipboard({ timeout: 2000 });

  const navRef = useRef<HTMLElement>(null);
  const { profileInfo } = useAppState();
  const { classes } = useStyles({ collapsed });
  const { replace, pathname } = useRouter();

  const { logout } = useLogout({
    onLogout: () => replace(ROUTES.SIGNIN),
  });

  usePlanDetails({ projectId: profileInfo?._projectId });
  const { projects, onEditImportClick, isProjectsLoading, isProfileLoading } = useProject();

  const handleCopyEmail = () => {
    copy(profileInfo?.email || '');
    notify('Email Copied', {
      title: 'Email Copied',
      message: 'Email Copied To Clipboard',
      color: 'green',
    });
  };

  return (
    <>
      <Head>
        <meta name="og:image" content="/banner.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageProps.title ? `${pageProps.title} | Impler` : 'Impler'}</title>
        <link rel="icon" href={'/favicon-dark.ico'} />
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
      </Head>
      <div className={classes.root}>
        <LoadingOverlay visible={isProjectsLoading || isProfileLoading} />
        <aside className={classes.aside}>
          <div className={classes.logoContainer}>
            {collapsed ? (
              <Image onClick={() => replace('/')} src={DarkLogo} alt="Impler Logo" width={25} height={30} />
            ) : (
              <Image onClick={() => replace('/')} src={LogoWhite} alt="Impler Logo" width={120} height={30} />
            )}
          </div>

          {!collapsed && (
            <div style={{ padding: '0 8px' }}>
              <UnstyledButton
                w="100%"
                onClick={onEditImportClick}
                px="sm"
                py="xs"
                style={{
                  border: `1px solid ${colors.lightGrey}`,
                }}
              >
                <Group position="apart" color={colors.TXTGray}>
                  <Text color={colors.TXTGray}>
                    {projects?.find((project) => project._id === profileInfo?._projectId)?.name ||
                      'No Project Selected'}
                  </Text>
                  <EditProjectIcon color={colors.TXTGray} />
                </Group>
              </UnstyledButton>
            </div>
          )}

          <Flex direction="column" justify="space-between" h="100%">
            <div className={classes.navSection}>
              <Stack spacing="lg" py="xs" align={collapsed ? 'center' : 'stretch'}>
                <NavItem active={pathname === '/'} href="/" icon={<HomeIcon />} title={!collapsed ? 'Home' : ''} />
                <NavItem
                  active={pathname.includes('/imports')}
                  href="/imports"
                  icon={<ImportIcon />}
                  title={!collapsed ? 'Imports' : ''}
                />
                <NavItem
                  active={pathname.includes('/activities')}
                  href="/activities"
                  icon={<ActivitiesIcon />}
                  title={!collapsed ? 'Activities' : ''}
                />
                <NavItem
                  active={pathname.includes('/settings')}
                  href="/settings"
                  icon={<SettingsIcon />}
                  title={!collapsed ? 'Settings' : ''}
                />
                <NavItem
                  active={pathname.includes('/team-members')}
                  href="/team-members"
                  icon={<PeopleIcon />}
                  title={!collapsed ? 'Team Members' : ''}
                />
                <Can I={ActionsEnum.READ} a={SubjectsEnum.DOCUMENTATION}>
                  <NavItem
                    target="_blank"
                    title={!collapsed ? 'Documentation' : ''}
                    href="https://docs.impler.io"
                    icon={<OutLinkIcon />}
                  />
                </Can>
              </Stack>
            </div>

            <Flex pb="xs" direction="column">
              <Divider my="xs" />
              <div className={classes.userMenuContainer}>
                <UserMenu
                  collapsed={collapsed}
                  user={{
                    name: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
                    email: profileInfo?.email || '',
                    image: profileInfo?.profilePicture || '',
                  }}
                  menus={[
                    {
                      title: profileInfo?.email || '',
                      icon: <EmailIcon />,
                      onClick: () => {
                        handleCopyEmail();
                        console.log('Email clicked');
                      },
                    },
                    { title: 'Logout', icon: <LogoutIcon />, onClick: logout },
                  ]}
                />
              </div>
            </Flex>
          </Flex>
        </aside>
        <main className={classes.main}>
          <nav ref={navRef}>
            {profileInfo && (
              <Flex justify="space-between" align="center" px="md" py="sm">
                <Group align="center">
                  <Tooltip label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'} withArrow position="bottom-start">
                    <UnstyledButton onClick={() => setCollapsed((isCollapsed) => !isCollapsed)}>
                      {collapsed ? <DrawerRightOpenIcon size="lg" /> : <DrawerLeftCloseIcon size="lg" />}
                    </UnstyledButton>
                  </Tooltip>

                  <Title order={2}>
                    Welcome, {profileInfo.firstName} {profileInfo.lastName}
                  </Title>
                </Group>
              </Flex>
            )}
          </nav>
          <div className={classes.content}>
            <div className={classes.contentBox}>{children}</div>
          </div>
        </main>
      </div>
      <Support profile={profileInfo} />
    </>
  );
}
