import { Alert } from '@mantine/core';
import AlertIcon from '@icons/alert';
import useStyles from './Styles';

const Information = () => {
  const { classes } = useStyles();

  return (
    <Alert
      icon={<AlertIcon />}
      title="See how fast and easily you can import temperature records in seconds with Impler,"
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
