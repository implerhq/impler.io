import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';

interface IWrapperProps {
  active: number;
}

export function Wrapper(props: PropsWithChildren<IWrapperProps>) {
  const { children, active } = props;

  return (
    <div style={{ paddingRight: 24, paddingLeft: 24, paddingBottom: 24, border: '1px solid transparent' }}>
      {/* Heading */}
      <Heading active={active} />
      {children}
    </div>
  );
}
