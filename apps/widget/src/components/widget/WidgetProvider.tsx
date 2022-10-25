import { ApiService } from '../../client';
import ImplerContextProvider from '../../store/impler.context';
import APIContextProvider from '../../store/api.context';

interface IWidgetProviderProps {
  // api-context
  backendUrl: string;
  // impler-context
  projectId: string;
  template: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
  // other
  children: React.ReactNode;
}

let api: ApiService;

export function WidgetProvider(props: IWidgetProviderProps) {
  if (!api) api = new ApiService(props.backendUrl);

  return (
    <ImplerContextProvider
      projectId={props.projectId}
      template={props.template}
      accessToken={props.accessToken}
      extra={props.extra}
      authHeaderValue={props.authHeaderValue}
    >
      <APIContextProvider api={api}>{props.children}</APIContextProvider>
    </ImplerContextProvider>
  );
}
