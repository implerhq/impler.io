import { Container as MantineContainer, MantineSize } from '@mantine/core';
import React from 'react';

interface ContainerProps extends React.PropsWithChildren {
  size?: MantineSize;
  className?: string;
}

const Container = ({ children, size = 'xl', className }: ContainerProps) => {
  return (
    <MantineContainer size={size} className={className}>
      {children}
    </MantineContainer>
  );
};

export default Container;
