import { Pagination as MantinePagination, Group } from '@mantine/core';

interface IPaginationProps {
  page?: number;
  total: number;
  size?: 'sm' | 'md';
  onChange?: (page: number) => void;
}

export function Pagination(props: IPaginationProps) {
  const defaultPage = 1;
  const { total, page = defaultPage, size = 'md', onChange } = props;

  return (
    <Group style={{ justifyContent: 'center' }}>
      <MantinePagination total={total} page={page} size={size} onChange={onChange} />
    </Group>
  );
}
