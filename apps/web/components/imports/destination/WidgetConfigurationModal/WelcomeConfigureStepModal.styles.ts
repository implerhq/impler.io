import { MantineTheme, createStyles } from '@mantine/core';
import { colors } from '@config';

export const getContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: 0,
  paddingTop: theme.spacing.md,
  margin: 0,
});

export const getHeroBannerStyles = (): React.CSSProperties => ({
  background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 100%)',
  padding: '1.5rem 1.5rem 1rem',
  margin: 0,
});

export const getHeroTitleStyles = (): React.CSSProperties => ({
  color: '#34f60eff',
  marginBottom: '1rem',
});

export const getHeroTextStyles = (): React.CSSProperties => ({
  color: colors.white,
  lineHeight: 1.6,
});

export const getSectionTitleStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontSize: theme.fontSizes.lg,
  fontWeight: 500,
  marginBottom: theme.spacing.xs,
  marginTop: theme.spacing.xs,
});

export const getActionCardStyles = () => ({
  backgroundColor: colors.BGSecondaryDark,
  cursor: 'pointer',
  transition: 'all 0.2s',
  borderRadius: 0,
  border: '1px solid #2e2e2e',

  '&:hover': {
    backgroundColor: `${colors.blue} !important`,
  },
});

export const getIconWrapperStyles = (): React.CSSProperties => ({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
});

export const getCardTitleStyles = (): React.CSSProperties => ({
  fontWeight: 400,
  color: colors.white,
});

export const useWelcomeConfigureStepModalStyles = createStyles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (theme: MantineTheme): Record<string, any> => ({
    container: getContainerStyles(theme),
    heroBanner: getHeroBannerStyles(),
    heroTitle: getHeroTitleStyles(),
    heroText: getHeroTextStyles(),
    sectionTitle: getSectionTitleStyles(theme),
    actionCard: getActionCardStyles(),
    iconWrapper: getIconWrapperStyles(),
    cardTitle: getCardTitleStyles(),
  })
);
