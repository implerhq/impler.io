import { useMediaQuery } from '@mantine/hooks';
import { Pagination as MantinePagination, Group, useMantineTheme } from '@mantine/core';
import useStyles from './Pagination.style';
import { variables } from '@config';

interface IPaginationProps {
  page?: number;
  total: number;
  size?: 'sm' | 'md';
  onChange?: (page: number) => void;
}

export function Pagination(props: IPaginationProps) {
  const defaultPage = 1;
  const theme = useMantineTheme();
  const isLessThanMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const { classes } = useStyles();
  const { total, page = defaultPage, size = 'md', onChange } = props;

  return (
    <Group style={{ justifyContent: 'center' }}>
      <MantinePagination
        noWrap
        boundaries={isLessThanMd ? variables.baseIndex : variables.firstIndex}
        classNames={classes}
        total={total}
        page={page}
        size={size}
        onChange={onChange}
      />
    </Group>
  );
}
