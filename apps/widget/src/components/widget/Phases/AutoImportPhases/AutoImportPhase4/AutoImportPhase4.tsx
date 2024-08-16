import { colors } from '@config';
import { CheckIcon } from '@icons';
import { WIDGET_TEXTS } from '@impler/shared';
import { Text, Stack, Paper } from '@mantine/core';
import { useJobsInfo } from '@store/jobinfo.context';
const parseCronExpression = require('util/helpers/cronstrue');

import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';

interface IAutoImportPhase4Props {
  onCloseClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function AutoImportPhase4({ onCloseClick, texts }: IAutoImportPhase4Props) {
  const { jobsInfo } = useJobsInfo();

  return (
    <>
      <Stack mt="md" align="center" style={{ flexGrow: 1 }}>
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
          <Text color={colors.lightBlue}>{jobsInfo.url}</Text>
        </Paper>
        <Text fw="bold" color={colors.softGrey}>
          Will be executed on {parseCronExpression.toString(jobsInfo.cron)}
        </Text>
      </Stack>
      <AutoImportFooter
        onNextClick={onCloseClick}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.CONFIRM}
        texts={texts}
      />
    </>
  );
}
