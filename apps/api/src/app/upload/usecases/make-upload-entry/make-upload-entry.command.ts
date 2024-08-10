export class MakeUploadEntryCommand {
  file: Express.Multer.File;
  templateId: string;
  extra?: string;
  schema?: string;
  output?: string;
  importId?: string;
  imageSchema?: string;
  authHeaderValue?: string;
  selectedSheetName?: string;
}
