import JSZip from 'jszip';
import { useMutation } from '@tanstack/react-query';

import { variables } from '@config';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL, getFileNameFromUrl, notifier } from '@util';
import { ColumnTypesEnum, FileMimeTypesEnum, IErrorObject, ISchemaItem, ITemplate, downloadFile } from '@impler/shared';

interface UseSampleProps {
  onDownloadComplete?: () => void;
}

export function useSample({ onDownloadComplete }: UseSampleProps) {
  const { api } = useAPIState();
  const { schema, data } = useAppState();
  const { mutate: getSignedUrl, isLoading: isGetSignedUrlLoading } = useMutation<
    string,
    IErrorObject,
    [string, string]
  >(['getSignedUrl'], ([fileUrl]) => api.getSignedUrl(getFileNameFromUrl(fileUrl)), {
    onSuccess(signedUrl, queryVariables) {
      downloadFileFromURL(signedUrl, queryVariables[variables.firstIndex]);
    },
    onError(error: IErrorObject) {
      notifier.showError({ title: error.error, message: error.message });
    },
  });
  const { mutate: downloadSample, isLoading: isDownloadSampleLoading } = useMutation<
    ArrayBuffer,
    IErrorObject,
    { templateId: string; name: string; isMultiSelect: boolean; sampleData: FormData },
    [string]
  >(['downloadSample'], ({ templateId, sampleData }) => api.downloadSample(templateId, sampleData), {
    onSuccess(excelFileData, queryVariables) {
      downloadFile(
        new Blob([excelFileData], {
          type: queryVariables.isMultiSelect ? FileMimeTypesEnum.EXCELM : FileMimeTypesEnum.EXCELX,
        }),
        queryVariables.name + ` (sample).${queryVariables.isMultiSelect ? 'xlsm' : 'xlsx'}`
      );
      if (onDownloadComplete) onDownloadComplete();
    },
  });

  const onDownload = async ({
    template,
    images,
    importId,
    imageSchema,
  }: {
    images?: JSZip;
    importId?: string;
    template: ITemplate;
    imageSchema?: string;
  }) => {
    const sampleData = new FormData();
    let parsedSchema: ISchemaItem[] | undefined = undefined;
    try {
      if (schema) parsedSchema = JSON.parse(schema);
    } catch (error) {}

    let isMultiSelect = template.sampleFileUrl?.endsWith('xlsm');
    if (Array.isArray(parsedSchema)) {
      isMultiSelect = parsedSchema.some(
        (schemaItem) => schemaItem.type === ColumnTypesEnum.SELECT && schemaItem.allowMultiSelect
      );
      sampleData.append('schema', JSON.stringify(parsedSchema));
    }
    if (Array.isArray(data)) sampleData.append('data', JSON.stringify(data));
    if (images && importId && imageSchema) {
      const imagesBlob = await images.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      sampleData.append('file', imagesBlob);
      sampleData.append('imageSchema', imageSchema);
      sampleData.append('importId', importId);
    }

    downloadSample({
      isMultiSelect: !!isMultiSelect,
      name: template.name,
      templateId: template._id,
      sampleData,
    });
  };

  return {
    onDownload,
    getSignedUrl,
    downloadSample,
    isGetSignedUrlLoading,
    isDownloadSampleLoading,
  };
}
