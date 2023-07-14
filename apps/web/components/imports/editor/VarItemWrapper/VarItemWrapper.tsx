import { CopyButton, Tooltip } from '@mantine/core';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { CheckIcon } from '@assets/icons/Check.icon';
import { colors } from '@config';
import { VarItem } from '../VarItem';

interface VarItemWrapperProps {
  name: string;
  copyText?: string;
}

export const VarItemWrapper = ({ name, copyText = name }: VarItemWrapperProps) => {
  return (
    <Tooltip label="Copy">
      <CopyButton value={copyText}>
        {({ copied, copy }) => (
          <VarItem name={name} onClick={copy} icon={copied ? <CheckIcon color={colors.success} /> : <CopyIcon />} />
        )}
      </CopyButton>
    </Tooltip>
  );
};
