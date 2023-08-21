import { Text, List } from '@mantine/core';

interface PossibleJSONErrorsProps {
  title?: string;
  errors?: string[];
}

export function PossibleJSONErrors({
  title = 'This can be the reason:',
  errors = [
    'Extra (,) before closing bracket (}).',
    'Missing (,) in between two pairs or objects.',
    'Keys are not quoted into double quote (").',
  ],
}: PossibleJSONErrorsProps) {
  return (
    <>
      <Text fw="bold">{title}</Text>
      <List>
        {errors.map((error) => (
          <List.Item key={error}>{error}</List.Item>
        ))}
      </List>
    </>
  );
}
