import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    maxWidth: '500px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  animationContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  animationWrapper: {
    position: 'relative',
    width: '160px',
    height: '160px',
    margin: '0 auto',
    overflow: 'hidden',
  },

  animation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '160px',
    height: '160px',
    pointerEvents: 'none' as const,
  },

  iconWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },

  iconContainer: {
    backgroundColor: '#00CE07',
    color: 'white',
    borderRadius: '50%',
    height: 60,
    width: 60,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
}));
