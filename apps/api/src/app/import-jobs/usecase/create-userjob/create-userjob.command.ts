export class CreateUserJobCommand {
  webSocketSessionId: string;
  url: string;
  extra?: string;
  _templateId: string;
  externalUserId?: string;
  authHeaderValue?: string;
}
