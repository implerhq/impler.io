import { Alert } from '@mantine/core';
import AlertIcon from '@icons/alert';
import useStyles from './Styles';

const Information = () => {
  const { classes } = useStyles();

  return (
    <Alert
      icon={<AlertIcon />}
      title="See how you can import 50k temperature records in seconds with Impler,"
      classNames={classes}
    >
      <ul className={classes.list}>
        <li>Download the Temperature data file</li>
        <li>Click on Import and follow the steps</li>
        <li>See the Imported data in the table below</li>
      </ul>
    </Alert>
  );
};

export default Information;
