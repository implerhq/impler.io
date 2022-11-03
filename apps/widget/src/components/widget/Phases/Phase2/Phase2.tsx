import { Group, Text } from '@mantine/core';
import { MappingItem } from '@ui/MappingItem';
import { TEXTS } from '@config';
import { Footer } from 'components/Common/Footer';

interface IPhase2Props {
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Phase2(props: IPhase2Props) {
  const { onPrevClick, onNextClick } = props;
  const options = [
    {
      label: 'Firstname',
      value: '1',
    },
    {
      label: 'Lastname',
      value: '2',
    },
  ];

  return (
    <Group style={{ flexDirection: 'column', width: '100%', alignItems: 'unset', gap: 0 }}>
      {/* Heading */}
      <Group style={{ justifyContent: 'space-between' }} noWrap>
        <Group style={{ width: '70%' }} align="stretch" noWrap>
          <Text color="dimmed" style={{ width: '50%' }}>
            {TEXTS.PHASE2.NAME_IN_SCHEMA_TITLE}
          </Text>
          <Text color="dimmed" style={{ width: '50%' }}>
            {TEXTS.PHASE2.NAME_IN_SHEET_TITLE}
          </Text>
        </Group>
      </Group>
      {/* Mapping Items */}
      <Group>
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
        <MappingItem options={options} heading="First Name" />
      </Group>

      <Footer active={2} onNextClick={onNextClick} onPrevClick={onPrevClick} />
    </Group>
  );
}
