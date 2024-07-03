import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { logAmplitudeEvent } from '@amplitude';
import { useMutation, useQuery } from '@tanstack/react-query';

import { variables } from '@config';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { IFormvalues, IUploadValues } from '@types';
import { useImplerState } from '@store/impler.context';
import { ColumnTypesEnum, IErrorObject, IOption, ISchemaItem, ITemplate, IUpload } from '@impler/shared';
import { FileMimeTypesEnum, IImportConfig, downloadFile } from '@impler/shared';
import { downloadFileFromURL, getFileNameFromUrl, notifier, ParentWindow } from '@util';

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const { api } = useAPIState();
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [excelSheetNames, setExcelSheetNames] = useState<string[]>([]);
  const { projectId, templateId, authHeaderValue, extra } = useImplerState();
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { setUploadInfo, setTemplateInfo, setImportConfig, output, schema, data } = useAppState();

  const { isFetched: isImportConfigLoaded, isLoading: isImportConfigLoading } = useQuery<
    IImportConfig,
    IErrorObject,
    IImportConfig
  >(['importConfig'], () => api.getImportConfig(projectId), {
    onSuccess(importConfigResponse) {
      setImportConfig(importConfigResponse);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const {
    data: dataTemplates,
    isFetched,
    isLoading,
  } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(
    ['templates', projectId],
    () => api.getTemplates(projectId),
    {
      onSuccess(templatesResponse) {
        setTemplates(
          templatesResponse.map((item) => ({
            label: item.name,
            value: item._id,
          }))
        );
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      refetchOnMount: 'always',
    }
  );
  const { isLoading: isUploadLoading, mutate: submitUpload } = useMutation<IUpload, IErrorObject, IUploadValues>(
    ['upload'],
    (values: any) => api.uploadFile(values),
    {
      onSuccess(uploadData) {
        ParentWindow.UploadStarted({ templateId: uploadData._templateId, uploadId: uploadData._id });
        setUploadInfo(uploadData);
        goNext();
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );
  const { mutate: getSignedUrl } = useMutation<string, IErrorObject, [string, string]>(
    ['getSignedUrl'],
    ([fileUrl]) => api.getSignedUrl(getFileNameFromUrl(fileUrl)),
    {
      onSuccess(signedUrl, queryVariables) {
        downloadFileFromURL(signedUrl, queryVariables[variables.firstIndex]);
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );
  const { mutate: downloadSample } = useMutation<ArrayBuffer, IErrorObject, [string, string, boolean]>(
    ['downloadSample'],
    ([providedTemplateId]) => api.downloadSample(providedTemplateId, data, schema),
    {
      onSuccess(excelFileData, queryVariables) {
        const isMultiSelect = queryVariables[variables.secondIndex];
        downloadFile(
          new Blob([excelFileData], {
            type: isMultiSelect ? FileMimeTypesEnum.EXCELM : FileMimeTypesEnum.EXCELX,
          }),
          queryVariables[variables.firstIndex] + ` (sample).${isMultiSelect ? 'xlsm' : 'xlsx'}`
        );
      },
    }
  );
  const { mutate: getExcelSheetNames } = useMutation<string[], IErrorObject, { file: File }>(
    ['getExcelSheetNames'],
    (file) => api.getExcelSheetNames(file),
    {
      onSuccess(sheetNames) {
        if (sheetNames.length <= 1) {
          setValue('selectedSheetName', sheetNames[0]);
          handleSubmit(uploadFile)();
        } else setExcelSheetNames(sheetNames);
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );
  const {
    control,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();

  useEffect(() => {
    if (templateId) {
      setValue('templateId', templateId);
      const foundTemplate = dataTemplates?.find((templateItem) => templateItem._id === templateId);
      if (foundTemplate) {
        setTemplateInfo(foundTemplate);
      }
    }
  }, [templateId, dataTemplates]);

  const findTemplate = (): ITemplate | undefined => {
    let foundTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('templateId');
    if (selectedTemplateValue && dataTemplates) {
      foundTemplate = dataTemplates.find((templateItem) => templateItem._id === selectedTemplateValue);
    }
    if (!foundTemplate) notifier.showError('TEMPLATE_NOT_FOUND');
    else if (foundTemplate.totalColumns === variables.baseIndex) notifier.showError('INCOMPLETE_TEMPLATE');
    else return foundTemplate;

    return undefined;
  };
  const onTemplateChange = (newTemplateId: string) => {
    const foundTemplate = dataTemplates?.find((templateItem) => templateItem._id === newTemplateId);
    if (foundTemplate) {
      setTemplateInfo(foundTemplate);
      setValue('templateId', newTemplateId);
      trigger('templateId');
    }
  };
  const onDownload = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('templateId');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    const foundTemplate = findTemplate();
    let parsedSchema: ISchemaItem[] | undefined = undefined;
    try {
      if (schema) parsedSchema = JSON.parse(schema);
    } catch (error) {}

    if (foundTemplate && ((Array.isArray(data) && data.length > variables.baseIndex) || schema)) {
      const isMultiSelect = Array.isArray(parsedSchema)
        ? parsedSchema.some((schemaItem) => schemaItem.type === ColumnTypesEnum.SELECT && schemaItem.allowMultiSelect)
        : foundTemplate.sampleFileUrl?.endsWith('xlsm');
      downloadSample([foundTemplate._id, foundTemplate.name, !!isMultiSelect]);
    } else if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([
        foundTemplate.sampleFileUrl,
        foundTemplate.name + ` (sample).${foundTemplate.sampleFileUrl.substr(-4, 4)}`,
      ]);
    }
    setIsDownloadInProgress(false);
  };
  const uploadFile = async (submitData: IFormvalues) => {
    const foundTemplate = findTemplate();
    if (foundTemplate) {
      submitData.templateId = foundTemplate._id;
      logAmplitudeEvent('UPLOAD', { fileSize: submitData.file.size, fileType: submitData.file.type });
      submitUpload({
        ...submitData,
        authHeaderValue,
        extra,
        schema,
        output,
      });
    }
  };
  const onSubmit = async () => {
    await trigger();
    const file = getValues('file');
    if (file && [FileMimeTypesEnum.EXCEL, FileMimeTypesEnum.EXCELX].includes(file.type as FileMimeTypesEnum)) {
      getExcelSheetNames({ file: file });
    } else {
      handleSubmit(uploadFile)();
    }
  };
  const onSelectSheetModalReset = () => {
    setExcelSheetNames([]);
  };

  return {
    control,
    errors,
    setError,
    register,
    onSubmit,
    templates,
    onDownload,
    excelSheetNames,
    isUploadLoading,
    onTemplateChange,
    isDownloadInProgress,
    onSelectSheetModalReset,
    showSelectTemplate: !templateId,
    onSelectExcelSheet: handleSubmit(uploadFile),
    isInitialDataLoaded: isFetched && !isLoading && isImportConfigLoaded && !isImportConfigLoading,
  };
}
