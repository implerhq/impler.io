import { keyframes } from '@emotion/react';
import { createStyles, MantineTheme } from '@mantine/core';

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

export const useStyles = createStyles((theme: MantineTheme) => ({
  splitContainer: {
    minHeight: '100vh',
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '100%',
    [theme.fn.largerThan('md')]: {
      display: 'grid',
      gridTemplateColumns: '60% 40%',
    },
    [theme.fn.smallerThan('md')]: {
      background:
        'linear-gradient(135deg, #6b2323ff 0%, #4A2C42 20%, #2D2F5A 40%, #1A2847 60%, #0F1B3D 80%, #0A0F2C 100%)',
      animation: `${subtleGradientShift} 20s ease-in-out infinite`,
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
        'linear-gradient(135deg, #6b2323ff 0%, #4A2C42 20%, #2D2F5A 40%, #1A2847 60%, #0F1B3D 80%, #0A0F2C 100%)',
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
