export interface ButtonProps {
  projectId: string;
  template?: string;
  authHeaderValue?: string | (() => string);
  extra?: string | Record<string, any>;
  children?: React.ReactNode;
  className?: string;
}
