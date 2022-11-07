export interface ButtonProps {
  projectId: string;
  accessToken?: string;
  template?: string;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
  extra?: string | Record<string, any>;
  children?: React.ReactNode;
  className?: string;
}
