import { colors } from '@config';
import { CheckIcon } from '@icons';
import { Text, Stack, Center, Paper } from '@mantine/core';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';

interface IAutoImportPhase4Props {
  onNextClick: () => void;
}

export function AutoImportPhase4(props: IAutoImportPhase4Props) {
  console.log(props);

  return (
    <Center>
      <Stack mt="xl" align="center" spacing="lg">
        <CheckIcon
          styles={{
            backgroundColor: 'green',
            borderRadius: '50%',
            color: 'white',
            width: 50,
            height: 50,
          }}
        />
        <Text fw="bold" size="xl" color={colors.lightBlue}>
          Import Job is Scheduled From URL
        </Text>
        <Paper bg={colors.softBlue} style={{ maxWidth: '100%', width: 'fit-content' }} p="xl">
          <Text color={colors.lightBlue}>https://timesofindia.com/rssfeeds/-2121212121.cms</Text>
        </Paper>
        <Text fw="bold" color={colors.softGrey}>
          Will be executed on Every Sunday 12:00 AM
        </Text>
      </Stack>
      <AutoImportFooter
        onNextClick={() => {}}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.CONFORM}
      />
    </Center>
  );
}
