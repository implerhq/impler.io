import { PropsWithChildren, useState } from 'react';
import { colors } from '@config';
import { Collapse, UnstyledButton, useMantineTheme } from '@mantine/core';
import { ChevronDownIcon } from '@assets/icons/ChevronDown.icon';
import { ChevronUpIcon } from '@assets/icons/ChevronUp.icon';

interface VarLabelProps {
  label: string;
}

export const VarLabel = ({ label, children }: PropsWithChildren<VarLabelProps>) => {
  const [open, setOpen] = useState(true);
  const theme = useMantineTheme();

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
          backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
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
          borderBottom: `1px solid ${theme.colorScheme === 'dark' ? colors.StrokeDark : colors.StrokeLight}`,
          marginBottom: 10,
          paddingLeft: 12,
        }}
      >
        {children}
      </Collapse>
    </>
  );
};
