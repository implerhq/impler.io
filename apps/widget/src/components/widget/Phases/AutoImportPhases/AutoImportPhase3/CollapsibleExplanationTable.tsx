import { Flex, Text, Collapse, Table, UnstyledButton, Stack } from '@mantine/core';
import { ChevronDown } from '@icons';
import { colors } from '@config';

interface CollapsibleExplanationTableProps {
  opened: boolean;
  toggle: () => void;
  cronExamples: { expression: string; schedule: string }[];
}

export function CollapsibleExplanationTable({ cronExamples, opened, toggle }: CollapsibleExplanationTableProps) {
  return (
    <Stack spacing="xs" p="xs" style={{ border: `1px solid #f0f0f0` }} bg={colors.white}>
      <UnstyledButton onClick={toggle}>
        <Flex justify="center" align="center" onClick={toggle}>
          <Text size="md" fw="bold" mr="sm">
            Valid Values
          </Text>
          <ChevronDown
            styles={{
              transition: 'transform 0.3s ease',
              transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Flex>
      </UnstyledButton>

      <Collapse in={opened}>
        <Table highlightOnHover>
          <thead>
            <tr style={{ backgroundColor: '#edf3ff' }}>
              <th style={{ textAlign: 'center' }}>Cron Expression</th>
              <th style={{ textAlign: 'center' }}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {cronExamples.map((example, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{example.expression}</td>
                <td style={{ textAlign: 'center' }}>{example.schedule}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Collapse>
    </Stack>
  );
}
