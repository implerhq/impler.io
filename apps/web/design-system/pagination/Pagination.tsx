import { VARIABLES } from '@config';
import useStyles from './Pagination.styles';
import { numberFormatter } from '@impler/shared';
import { Flex, Text, NativeSelect, Pagination as MantinePagination } from '@mantine/core';

const limits = [
  { value: '10', label: '10' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
];

interface PaginationProps {
  limit: number;
  onLimitChange: (value: number) => void;
  dataLength: number;
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
  totalRecords: number;
}

export function Pagination({
  limit,
  onLimitChange,
  dataLength,
  page,
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
      <Flex align="center" gap="sm" className={classes.statistics}>
        <Text>Results per page</Text>
        <NativeSelect
          data={limits}
          size="xs"
          radius={0}
          value={limit}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLimitChange(Number(e.target.value))}
          disabled={dataLength === VARIABLES.ZERO}
          classNames={{ input: classes.selectInput }}
        />
      </Flex>
      <MantinePagination
        siblings={1}
        boundaries={0}
        noWrap={false}
        page={page}
        onChange={setPage}
        total={totalPages}
        classNames={{ item: classes.item }}
        disabled={dataLength === VARIABLES.ZERO}
      />
      <Text className={classes.statistics}>
        Showing {paginationFrom()}-{paginationTo()} of {numberFormatter(totalRecords)} records
      </Text>
    </div>
  );
}

export default Pagination;
