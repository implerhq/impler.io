import { Flex, Text, Collapse, Table, UnstyledButton, Stack } from '@mantine/core';
import { fieldAllowedValues } from '@config';
import { ChevronDown } from '@icons';
import { colors } from '@config';

interface CollapsibleExplanationTableProps {
  opened: boolean;
  toggle: () => void;
  cronExamples: { expression: string; schedule: string }[];
  focusedField: string | null;
}

export function CollapsibleExplanationTable({
  cronExamples,
  opened,
  toggle,
  focusedField,
}: CollapsibleExplanationTableProps) {
  const getAllowedValues = () => {
    if (!focusedField) return [];

    return [{ expression: fieldAllowedValues[focusedField], schedule: `Allowed values for ${focusedField}` }];
  };

  const displayExamples = focusedField ? getAllowedValues() : cronExamples;

  return (
    <Stack spacing="xs" p="xs" style={{ border: `1px solid #f0f0f0` }} bg={colors.white}>
      <UnstyledButton onClick={toggle}>
        <Flex justify="center" align="center" onClick={toggle}>
          <Text size="md" fw="bold" mr="sm">
            {focusedField ? `Allowed Values for ${focusedField}` : 'Valid Values'}
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
              <th style={{ textAlign: 'center' }}>Allowed Values</th>
              <th style={{ textAlign: 'center' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {displayExamples.map((example, index) => (
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
