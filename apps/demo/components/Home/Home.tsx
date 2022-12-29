import { useEffect } from 'react';
import Actions from '@components/Actions';
import { ApiService } from '@impler/client';
import DataView from '@components/DataView';
import Container from '@components/Container';
import Information from '@components/Information';
import AppContextProvider from '@context/app.context';
import APIContextProvider from '@context/api.context';
import useStyles from './Styles';

interface HomeProps {
  headerHeight: number;
}

let api: ApiService;

const Home = ({ headerHeight }: HomeProps) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!api) api = new ApiService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const { classes } = useStyles(headerHeight);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ACCESS_TOKEN) {
      api.setAuthorizationToken(process.env.NEXT_PUBLIC_ACCESS_TOKEN);
    }
  }, []);

  return (
    <main>
      <AppContextProvider>
        <APIContextProvider api={api}>
          <Container className={classes.container}>
            <Information />
            <Actions />
            <DataView />
          </Container>
        </APIContextProvider>
      </AppContextProvider>
    </main>
  );
};

export default Home;
