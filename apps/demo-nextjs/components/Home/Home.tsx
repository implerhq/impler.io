import Actions from '@components/Actions';
import Container from '@components/Container';
import DataView from '@components/DataView';
import Information from '@components/Information';
import useStyles from './Styles';

interface HomeProps {
  headerHeight: number;
}

const Home = ({ headerHeight }: HomeProps) => {
  const { classes } = useStyles(headerHeight);

  return (
    <main>
      <Container className={classes.container}>
        <Information />
        <Actions />
        <DataView />
      </Container>
    </main>
  );
};

export default Home;
