import { Group, Title, Text } from '@mantine/core';
import { colors, TEXTS } from '@config';
import { CheckIcon } from '@icons';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';

interface IPhase4Props {
  onUploadAgainClick: () => void;
  rowsCount: number;
}

export function Phase4(props: IPhase4Props) {
  const { classes } = useStyles();
  const { rowsCount, onUploadAgainClick } = props;

  return (
    <>
      <Group className={classes.wrapper}>
        <CheckIcon className={classes.check} />
        <Title color={colors.primary} order={2} mt="md">
          {TEXTS.COMPLETE.greeting}&nbsp;{rowsCount}&nbsp;{TEXTS.COMPLETE.title}
        </Title>
        <Text size="xl" color="dimmed">
          {TEXTS.COMPLETE.subTitle}
        </Text>
      </Group>

      <Footer active={4} onNextClick={onUploadAgainClick} onPrevClick={() => {}} />
    </>
  );
}
