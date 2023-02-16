/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '40px',
});

const getSigninColStyles = (theme: MantineTheme): Record<string, any> => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const getSigninContainerStyles = (theme: MantineTheme): Record<string, any> => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  padding: theme.spacing.sm,
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },
});

const getSlideStyles = (theme: MantineTheme): Record<string, any> => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const getCarouselColStyles = (theme: MantineTheme): Record<string, any> => ({
  backgroundImage: `url(/images/auth-bg.png)`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  padding: '40px',
  display: 'none',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    display: 'block',
  },
});

export default createStyles((theme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    signinCol: getSigninColStyles(theme),
    signinContainer: getSigninContainerStyles(theme),
    carouselCol: getCarouselColStyles(theme),
    slide: getSlideStyles(theme),
  };
});
