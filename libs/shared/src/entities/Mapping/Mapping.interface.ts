export class IMapping {
  _id: string;
  column: {
    _columnId: string;
    name: string;
    sequence: number;
  };
  columnHeading?: string;
}

export class IMappingFinalize {
  _columnId: string;
  columnHeading: string;
}
