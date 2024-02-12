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
  textAlign: 'center',
  padding: theme.spacing.sm,
  width: '100%',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    width: '75%',
  },
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '60%',
  },
});
const getSlideImageStyles = (): CSSObject => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
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

export default createStyles((theme): Record<string, any> => {
  return {
    root: getRootStyles(),
    grid: getGridStyles(),
    image: getSlideImageStyles(),
    viewport: getViewportStyles(),
    contentCol: getContentColStyles(),
    carouselCol: getCarouselColStyles(theme),
    contentContainer: getContentContainerStyles(theme),
  };
});
