import { PropsWithChildren, useState } from 'react';
import { colors } from '@config';
import { Collapse, UnstyledButton } from '@mantine/core';
import { ChevronDownIcon } from '@assets/icons/ChevronDown.icon';
import { ChevronUpIcon } from '@assets/icons/ChevronUp.icon';

interface VarLabelProps {
  label: string;
}

export const VarLabel = ({ label, children }: PropsWithChildren<VarLabelProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UnstyledButton
        data-test-id="var-label"
        onClick={() => {
          setOpen(!open);
        }}
        type="button"
        sx={{
          padding: 10,
          borderRadius: 7,
          marginBottom: 10,
          backgroundColor: colors.BGPrimaryDark,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {label}
          <span
            style={{
              float: 'right',
            }}
          >
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </div>
      </UnstyledButton>
      <Collapse
        in={open}
        style={{
          borderBottom: `1px solid ${colors.StrokeDark}`,
          marginBottom: 10,
          paddingLeft: 12,
        }}
      >
        {children}
      </Collapse>
    </>
  );
};
