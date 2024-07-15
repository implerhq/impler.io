export interface IXmlObject {
  [key: string]: any;
}

export interface IMapping {
  key: string;
  mapping: string;
}

export interface IMappedResult {
  [key: string]: string | undefined;
}
