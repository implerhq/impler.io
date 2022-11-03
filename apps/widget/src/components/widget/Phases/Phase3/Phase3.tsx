import { colors, TEXTS } from '@config';
import { Download, Warning } from '@icons';
import { Group, Text } from '@mantine/core';
import { Button } from '@ui/Button';
import { Pagination } from '@ui/Pagination';
import { Table } from '@ui/Table';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';

interface IPhase3Props {
  onNextClick: () => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const { classes } = useStyles();
  const { onNextClick, onPrevClick } = props;

  const data = Array.from({ length: 10 }).map(() => ({
    index: 10,
    error: '`fname` should not be empty, `email` should be unique',
    fname: '',
    lname: 'Doe',
    surname: 'Doe',
    gender: 'Male',
    email: 'johndoe@gmail.com',
    age: 20,
    city: 'Surat',
    country: 'India',
    state: 'Gujarat',
  }));

  return (
    <Group className={classes.container} spacing="sm">
      <Group className={classes.textContainer} align="center">
        <Group align="center" spacing="xs">
          <Warning fill={colors.red} className={classes.warningIcon} />
          <Text color={colors.red}>{TEXTS.PHASE3.INVALID_DATA_INFO}</Text>
        </Group>
        <Button size="sm" leftIcon={<Download />}>
          {TEXTS.PHASE3.EXPORT_DATA}
        </Button>
      </Group>

      <Table
        headings={[
          { key: 'index', title: '#', width: '4%' },
          { key: 'fname', title: 'First Name' },
          { key: 'lname', title: 'Last Name' },
          { key: 'surname', title: 'Surname' },
          { key: 'gender', title: 'Gender' },
          { key: 'email', title: 'Email' },
          { key: 'age', title: 'Age' },
          { key: 'city', title: 'City' },
          { key: 'country', title: 'Country' },
          { key: 'state', title: 'State' },
        ]}
        data={data}
      />
      <Pagination page={1} total={10} />

      <Footer active={3} onNextClick={onNextClick} onPrevClick={onPrevClick} />
    </Group>
  );
}
