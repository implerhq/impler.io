import { CSSProperties } from 'react';
import { createStyles, MantineTheme } from '@mantine/core';

const getContentWrapperStyles = (theme: MantineTheme): CSSProperties => ({
  width: '100%',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    width: '48%',
  },
});

export const getTemplateContainerStyles = (): CSSProperties => ({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  width: '100%',
});

export const getDownloadTemplateStyles = (): CSSProperties => ({
  width: '50%',
});

export const getFooterStyles = (): CSSProperties => ({
  alignSelf: 'flex-end',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    download: getDownloadTemplateStyles(),
    contentWrapper: getContentWrapperStyles(theme),
    templateContainer: getTemplateContainerStyles(),
  };
});
