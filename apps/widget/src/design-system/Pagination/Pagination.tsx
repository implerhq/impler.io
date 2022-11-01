import { Pagination as MantinePagination, Group, Text } from '@mantine/core';

interface IPaginationProps {
  page?: number;
  total: number;
  limit: number;
  totalRecords: number;
  size?: 'sm' | 'md';
  onChange?: (page: number) => void;
}

export function Pagination(props: IPaginationProps) {
  const { total, page = 1, limit, totalRecords, size = 'md', onChange } = props;

  return (
    <Group style={{ justifyContent: 'space-between' }}>
      <Text size={size}>
        {Math.max(0, Math.min((page - 1) * limit, totalRecords))}-{Math.max(0, Math.min(page * limit, totalRecords))} of{' '}
        {totalRecords}
      </Text>
      <MantinePagination total={total} page={page} size={size} onChange={onChange} />
    </Group>
  );
}
