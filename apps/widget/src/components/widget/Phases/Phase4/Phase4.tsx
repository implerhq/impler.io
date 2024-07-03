import { Group, Title, Text } from '@mantine/core';
import { TEXTS } from '@config';
import { CheckIcon } from '@icons';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';
import { useAppState } from '@store/app.context';

interface IPhase4Props {
  onCloseClick: () => void;
  onUploadAgainClick: () => void;
  rowsCount: number;
}

export function Phase4(props: IPhase4Props) {
  const { classes } = useStyles();
  const { primaryColor } = useAppState();
  const { rowsCount, onUploadAgainClick, onCloseClick } = props;

  return (
    <>
      <Group className={classes.wrapper}>
        <CheckIcon className={classes.check} />
        <Title className={classes.title} color={primaryColor} order={2} mt="md">
          {replaceVariablesInString(TEXTS.COMPLETE.TITLE, { count: numberFormatter(rowsCount) })}
        </Title>
        <Text className={classes.subTitle} color="dimmed">
          {replaceVariablesInString(TEXTS.COMPLETE.SUB_TITLE, { count: numberFormatter(rowsCount) })}
        </Text>
      </Group>

      <Footer active={PhasesEnum.COMPLETE} onNextClick={onUploadAgainClick} onPrevClick={onCloseClick} />
    </>
  );
}
