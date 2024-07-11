import { Paper, Flex, Text, Collapse, Table } from '@mantine/core';
import { ChevronDown } from '@icons';

interface CollapsibleExplanationTableProps {
  opened: boolean;
  toggle: () => void;
  cronExamples: { expression: string; schedule: string }[];
}

export function CollapsibleExplanationTable({ cronExamples, opened, toggle }: CollapsibleExplanationTableProps) {
  return (
    <Paper style={{ marginTop: '32px', padding: '16px', border: '1px solid #f0f0f0', backgroundColor: '#ffffff' }}>
      <Flex
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px',
        }}
        onClick={toggle}
      >
        <Text mr="sm">Explanation</Text>
        <ChevronDown
          styles={{
            transition: 'transform 0.3s ease',
            transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        />
      </Flex>

      <Collapse in={opened}>
        <Table highlightOnHover mt="md" style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#edf3ff' }}>
              <th style={{ padding: '8px', textAlign: 'center' }}>Cron Expression</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {cronExamples.map((example, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', textAlign: 'center' }}>{example.expression}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{example.schedule}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Collapse>
    </Paper>
  );
}
