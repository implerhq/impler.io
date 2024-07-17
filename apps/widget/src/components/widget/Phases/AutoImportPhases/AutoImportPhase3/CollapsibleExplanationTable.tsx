import { Flex, Text, Collapse, Table, UnstyledButton, Stack, Group } from '@mantine/core';
import { ChevronDown } from '@icons';
import { colors, cronFieldDefinitions } from '@config';

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
  const getFieldData = () => {
    if (!focusedField) return null;

    return cronFieldDefinitions.find((fieldObj) => fieldObj[focusedField]);
  };

  const fieldData = getFieldData();

  return (
    <Stack spacing="xs" p="xs" style={{ border: '1px solid #f0f0f0' }} bg={colors.white}>
      <Group></Group>
      <UnstyledButton onClick={toggle}>
        <Flex justify="center" align="center">
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
              <th style={{ textAlign: 'center' }}>{focusedField ? 'Allowed Values' : 'Expression'}</th>
              <th style={{ textAlign: 'center' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {!focusedField || !fieldData
              ? cronExamples.map((example, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{example.expression}</td>
                    <td style={{ textAlign: 'center' }}>{example.schedule}</td>
                  </tr>
                ))
              : fieldData[focusedField].values.map((value, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{value}</td>
                    <td style={{ textAlign: 'center' }}>{fieldData[focusedField].description[index]}</td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Collapse>
    </Stack>
  );
}
