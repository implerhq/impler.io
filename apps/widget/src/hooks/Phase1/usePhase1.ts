import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { logAmplitudeEvent } from '@amplitude';
import { useMutation } from '@tanstack/react-query';

import { notifier, ParentWindow } from '@util';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';
import { IErrorObject, ITemplate, IUpload, FileMimeTypesEnum, WIDGET_TEXTS } from '@impler/shared';

import { variables } from '@config';
import { useSample } from '@hooks/useSample';
import { useTemplates } from '@hooks/useTemplates';
import { IFormvalues, IUploadValues } from '@types';

interface IUsePhase1Props {
  goNext: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function usePhase1({ goNext, texts }: IUsePhase1Props) {
  const {
    control,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();
  const { api } = useAPIState();
  const { templates } = useTemplates();
  const { getSignedUrl, onDownload } = useSample({});
  const { templateId, authHeaderValue, extra } = useImplerState();
  const [excelSheetNames, setExcelSheetNames] = useState<string[]>([]);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { setUploadInfo, setTemplateInfo, output, schema, data, importId, imageSchema } = useAppState();

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
        resetField('file');
        setError('file', { type: 'file', message: error.message });
      },
    }
  );

  const { mutate: getExcelSheetNames, isLoading: isExcelSheetNamesLoading } = useMutation<
    string[],
    IErrorObject,
    { file: File }
  >(['getExcelSheetNames'], (file) => api.getExcelSheetNames(file), {
    onSuccess(sheetNames) {
      if (sheetNames.length <= 1) {
        setValue('selectedSheetName', sheetNames[0]);
        handleSubmit(uploadFile)();
      } else setExcelSheetNames(sheetNames);
    },
    onError(error: IErrorObject) {
      notifier.showError({ title: error.error, message: error.message });
    },
  });

  const findTemplate = (): ITemplate | undefined => {
    let foundTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('templateId');
    if (selectedTemplateValue && templates) {
      foundTemplate = templates.find((templateItem) => templateItem._id === selectedTemplateValue);
    }
    if (!foundTemplate) notifier.showError({ title: texts.COMMON.SORRY, message: texts.PHASE1.TEMPLATE_NOT_FOUND_MSG });
    else if (foundTemplate.totalColumns === variables.baseIndex)
      notifier.showError({ title: texts.COMMON.SORRY, message: texts.PHASE1.INCOMPLETE_TEMPLATE_MSG });
    else return foundTemplate;

    return undefined;
  };
  const onTemplateChange = (newTemplateId: string | null) => {
    const foundTemplate = templates?.find((templateItem) => templateItem._id === newTemplateId);
    if (foundTemplate && newTemplateId) {
      setTemplateInfo(foundTemplate);
      setValue('templateId', newTemplateId);
      trigger('templateId');
    }
  };
  const onDownloadClick = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('templateId');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    const foundTemplate = findTemplate();
    if (foundTemplate && ((Array.isArray(data) && data.length > variables.baseIndex) || schema)) {
      onDownload({ template: foundTemplate });
    } else if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([
        foundTemplate.sampleFileUrl,
        foundTemplate.name + ` (sample).${foundTemplate.sampleFileUrl.substr(-4, 4)}`,
      ]);
    }
    setIsDownloadInProgress(false);
  };
  const uploadFile = async (submitData: IFormvalues) => {
    setExcelSheetNames([]);
    const foundTemplate = findTemplate();
    if (foundTemplate) {
      submitData.templateId = foundTemplate._id;
      logAmplitudeEvent('UPLOAD', {
        fileSize: submitData.file.size,
        fileType: submitData.file.type,
        hasData: !!data,
        hasExtra: !!extra,
      });
      submitUpload({
        ...submitData,
        authHeaderValue,
        extra,
        schema,
        output,
        importId,
        imageSchema,
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

  useEffect(() => {
    if (templateId) {
      setValue('templateId', templateId);
    }
  }, [templateId]);

  return {
    control,
    errors,
    setError,
    register,
    onSubmit,
    templates,
    onDownloadClick,
    excelSheetNames,
    isUploadLoading,
    onTemplateChange,
    isDownloadInProgress,
    onSelectSheetModalReset,
    isExcelSheetNamesLoading,
    showSelectTemplate: !templateId,
    onSelectExcelSheet: handleSubmit(uploadFile),
  };
}
