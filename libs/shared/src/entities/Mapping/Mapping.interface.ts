export interface IMapping {
  _id: string;
  column: {
    _columnId: string;
    name: string;
    sequence: number;
  };
  columnHeading?: string;
}

export interface IMappingFinalize {
  _columnId: string;
  columnHeading: string;
}
