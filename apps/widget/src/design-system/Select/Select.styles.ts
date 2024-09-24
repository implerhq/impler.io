import { createStyles, MantineTheme } from '@mantine/core';

export const getLabelStyles = (): React.CSSProperties => ({});

export const getSelectStyles = (): React.CSSProperties => ({
  cursor: 'pointer',
});

export const getRootStyles = (width: string | number): React.CSSProperties => ({
  width,
});

export default createStyles((theme: MantineTheme, { width }: { width: string | number }): Record<string, any> => {
  return {
    label: getLabelStyles(),
    select: getSelectStyles(),
    root: getRootStyles(width),
  };
});
