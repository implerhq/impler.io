import { useContext } from 'react';
import { Flex, Text } from '@mantine/core';
import { AbilityContext } from 'store/ability.context';
import { ActionsEnum, AppAbility, SubjectsEnum } from '@config';

interface WithExtraParamsProps {
  subject: SubjectsEnum;
}

export function withProtectedResource<P extends WithExtraParamsProps>(
  WrappedComponent: React.ComponentType<P>,
  hocProps: WithExtraParamsProps
) {
  return function EnhancedComponent(props: Omit<P, keyof WithExtraParamsProps>) {
    const ability = useContext<AppAbility | null>(AbilityContext);

    if (ability && !ability.can(ActionsEnum.READ, hocProps.subject)) {
      return (
        <Flex justify="center" align="center" style={{ height: '100%' }}>
          <Text>You don&apos;t have access to this.</Text>
        </Flex>
      );
    }

    const newProps = {
      ...props,
      subject: hocProps.subject,
    } as P;

    return <WrappedComponent {...newProps} />;
  };
}
