import { LoadingOverlay as MantineLoadingOverlay } from '@mantine/core';

interface ILoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay(props: ILoadingOverlayProps) {
  const { visible } = props;

  return <MantineLoadingOverlay visible={visible} />;
}
