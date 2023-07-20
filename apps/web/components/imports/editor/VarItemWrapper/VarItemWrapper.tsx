import { Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

import { colors } from '@config';
import { VarItem } from '../VarItem';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { CheckIcon } from '@assets/icons/Check.icon';

interface VarItemWrapperProps {
  name: string;
  copyText?: string;
}

export const VarItemWrapper = ({ name, copyText = name }: VarItemWrapperProps) => {
  const { copied, copy } = useClipboard();

  return (
    <Tooltip label="Copy" withArrow>
      <VarItem
        name={name}
        onClick={() => copy(copyText)}
        icon={copied ? <CheckIcon color={colors.success} /> : <CopyIcon />}
      />
    </Tooltip>
  );
};
