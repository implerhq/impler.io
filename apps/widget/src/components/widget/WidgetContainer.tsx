import { Widget } from './Widget';
import { useParams } from 'react-router-dom';

export function NotificationCenterWidgetContainer() {
  const { projectId = '' } = useParams<{ projectId: string }>();

  return <Widget projectId={projectId} />;
}
