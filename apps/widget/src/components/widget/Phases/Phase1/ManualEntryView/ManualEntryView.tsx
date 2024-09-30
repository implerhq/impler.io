import { GridIcon, Warning } from '@icons';
import { Box, Group, Skeleton, Stack, Table, Text } from '@mantine/core';
import { Button } from '@ui/Button';
import { IColumn } from '@impler/shared';

interface ManaulEntryViewProps {
  columns?: IColumn[];
  className?: string;
}

export function ManaulEntryView({ columns, className }: ManaulEntryViewProps) {
  return (
    <Box bg="var(--secondary-background)" pt="sm" pl="sm" className={className}>
      <Stack spacing="xs">
        <div>
          <Button leftIcon={<GridIcon />}>Manually enter your data</Button>
        </div>
        <Group>
          <Warning fill="var(--error-color)" /> <Text>Recommanded upto 1K records.</Text>
        </Group>
        <Box
          pl="xs"
          pt="xs"
          bg="var(--primary-background)"
          style={{ borderTopLeftRadius: 'var(--border-radius)', overflow: 'hidden' }}
        >
          <Table>
            <thead style={{ backgroundColor: 'var(--secondary-background-hover)' }}>
              <tr>
                {columns?.map((column) => (
                  <th style={{ textWrap: 'nowrap' }} key={column.name}>
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  {columns?.map((column) => (
                    <td key={column.name}>
                      <Skeleton animate={false} height={15} radius="md" width="75%" bg="var(--secondary-background)" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Stack>
    </Box>
  );
}
