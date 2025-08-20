import { colors } from '@config';
import { createStyles, CSSObject, MantineTheme } from '@mantine/core';

const getRootStyles = (): React.CSSProperties => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '40px',
});

const getContentColStyles = (): Record<string, any> => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const getContentContainerStyles = (theme: MantineTheme): Record<string, any> => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing.sm,
  width: '100%',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    width: '75%',
  },
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    alignItems: 'flex-start',
    width: '65%',
  },
});

const getSlideImageStyles = (): CSSObject => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const getGridStyles = (): Record<string, any> => ({
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: colors.black,
});

const getViewportStyles = (): CSSObject => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const getLogoWrapperStyles = (theme: MantineTheme): CSSObject => ({
  position: 'absolute',
  top: theme.spacing.md,
  left: theme.spacing.md,
  zIndex: 10,
});

const getFormWrapperStyles = (): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  margin: '0 auto', // keeps center alignment
});

const getFormBoxStyles = (theme: MantineTheme): CSSObject => ({
  backgroundColor: theme.colors.dark[6],
  border: `1px solid ${theme.colors.gray[8]}`,
  borderRadius: theme.radius.sm,
  padding: theme.spacing.xl,
  boxShadow: theme.shadows.sm, // lighter shadow
  width: '100%',
  maxWidth: 400,
});

export default createStyles((theme): Record<string, any> => {
  return {
    root: getRootStyles(),
    grid: getGridStyles(),
    image: getSlideImageStyles(),
    viewport: getViewportStyles(),
    contentCol: getContentColStyles(),
    contentContainer: getContentContainerStyles(theme),
    logoWrapper: getLogoWrapperStyles(theme),
    formWrapper: getFormWrapperStyles(),
    formBox: getFormBoxStyles(theme),
  };
});
