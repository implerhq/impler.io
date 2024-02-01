import { VARIABLES } from '@config';
import useStyles from './Pagination.styles';
import { numberFormatter } from '@impler/shared';
import { Flex, Text, Select, Pagination as MantinePagination, MantineSize } from '@mantine/core';

const limits = [
  { value: '10', label: 'Show 10' },
  { value: '50', label: 'Show 50' },
  { value: '100', label: 'Show 100' },
  { value: '200', label: 'Show 200' },
];

interface PaginationProps {
  limit: number;
  onLimitChange: (value: number) => void;
  dataLength: number;
  page: number;
  size?: MantineSize;
  setPage: (value: number) => void;
  totalPages: number;
  totalRecords: number;
}

export function Pagination({
  limit,
  onLimitChange,
  dataLength,
  page,
  size = 'sm',
  setPage,
  totalPages,
  totalRecords,
}: PaginationProps) {
  const { classes } = useStyles();

  const paginationFrom = () => {
    return page ? page * limit - limit + VARIABLES.ONE : VARIABLES.ZERO;
  };
  const paginationTo = () => {
    return Math.min(page * limit, totalRecords);
  };

  return (
    <div className={classes.root}>
      <Flex align="center" gap="xs">
        <Select
          size={size}
          radius={0}
          data={limits}
          value={String(limit)}
          onChange={(value: string) => onLimitChange(Number(value))}
          disabled={dataLength === VARIABLES.ZERO}
          classNames={{ input: classes.selectInput }}
        />
        <Text size={size}>Records per page</Text>
      </Flex>
      <MantinePagination
        siblings={1}
        boundaries={0}
        noWrap={false}
        value={page}
        size={size}
        onChange={setPage}
        total={totalPages}
        classNames={{
          control: classes.item,
        }}
        disabled={dataLength === VARIABLES.ZERO}
      />
      <Text size={size}>
        Showing {paginationFrom()}-{paginationTo()} of {numberFormatter(totalRecords)} records
      </Text>
    </div>
  );
}

export default Pagination;
