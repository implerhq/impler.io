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
  PROJECT_ID: string;
  API_BASE_URL: string;
  ACCESS_TOKEN?: string;
  TEMPLATE?: string;
  PRIMARY_COLOR?: string;
}

let api: ApiService;

const Home = ({ headerHeight, API_BASE_URL, PROJECT_ID, ACCESS_TOKEN, PRIMARY_COLOR, TEMPLATE }: HomeProps) => {
  if (!api) api = new ApiService(API_BASE_URL);
  const { classes } = useStyles(headerHeight);

  useEffect(() => {
    if (ACCESS_TOKEN) {
      api.setAuthorizationToken(ACCESS_TOKEN);
    }
  }, [ACCESS_TOKEN]);

  return (
    <main>
      <AppContextProvider>
        <APIContextProvider api={api}>
          <Container className={classes.container}>
            <Information />
            <Actions
              PROJECT_ID={PROJECT_ID}
              ACCESS_TOKEN={ACCESS_TOKEN}
              PRIMARY_COLOR={PRIMARY_COLOR}
              TEMPLATE={TEMPLATE}
            />
            <DataView />
          </Container>
        </APIContextProvider>
      </AppContextProvider>
    </main>
  );
};

export default Home;
