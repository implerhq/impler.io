import { Group, Checkbox as MantineCheckbox, MantineNumberSize, Text, Tooltip } from '@mantine/core';
import useStyles from './Checkbox.styles';
import Link from 'next/link'; // Import Link component
import { GuidePointIcon } from '@assets/icons/GuidePoint.icon';
import { colors } from '@config';

interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  description?: string;
  size?: MantineNumberSize;
  link?: string;
}

export function Checkbox({ label, defaultChecked, register, checked, description, size, link }: CheckboxProps) {
  const { classes } = useStyles();
  const combinedDescription = (
    <Group spacing="xs" align="center">
      <Text>{description}</Text>
      {link && (
        <Tooltip label={'Read more'} withArrow>
          <Link href={link} target="_blank" rel="noopener noreferrer">
            <GuidePointIcon size="sm" color={colors.white} />
          </Link>
        </Tooltip>
      )}
    </Group>
  );

  return (
    <MantineCheckbox
      classNames={classes}
      defaultChecked={defaultChecked}
      checked={checked}
      label={label}
      size={size}
      description={combinedDescription}
      {...register}
    />
  );
}
