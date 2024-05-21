import { colors } from '@config';
import { Radio, Flex, Text } from '@mantine/core';

const paymentMethodIds = ['2', '3', '4', '5', '6', '7', '8'];

export function CardSelector() {
  return (
    <Radio.Group name="favoriteFramework" label="Select the card you want to proceed with">
      {paymentMethodIds.map((methodId) => (
        <label htmlFor={methodId} key={methodId}>
          <Flex justify="space-between" p="xs" style={{ border: `1px solid ${colors.TXTGray}`, cursor: 'pointer' }}>
            <Text fs="italic" size="md">
              #### #### #### 4242
            </Text>
            <Radio value={methodId} label={methodId} id={methodId} />
          </Flex>
        </label>
      ))}
    </Radio.Group>
  );
}
