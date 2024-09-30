import { createStyles } from '@mantine/core';

export default createStyles(
  (_, { orientation }: { orientation?: 'horizontal' | 'vertical'; size?: string | number }) => ({
    line: {
      borderColor: 'var(--secondary-background)',
      ...(orientation === 'horizontal'
        ? {
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            zIndex: 0,
            width: '43%',
          }
        : {
            borderLeftWidth: 1,
            borderLeftStyle: 'solid',
            zIndex: 0,
            marginLeft: 10,
            marginRight: 10,
            height: '43%',
          }),
    },
  })
);
