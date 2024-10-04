import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { logAmplitudeEvent } from '@amplitude';
import { useQuery, useMutation } from '@tanstack/react-query';

import { notifier } from '@util';
import { IUpload, WIDGET_TEXTS } from '@impler/client';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useUploadInfo } from '@hooks/useUploadInfo';
import { IMapping, IErrorObject, IMappingFinalize, replaceVariablesInString } from '@impler/shared';

interface IUsePhase2Props {
  goNext: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function usePhase2({ goNext, texts }: IUsePhase2Props) {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo } = useAppState();
  const [headings, setHeadings] = useState<
    {
      value: string;
      label: string;
      disabled?: boolean;
    }[]
  >(uploadInfo.headings.map((heading) => ({ value: heading, label: heading })));
  const { reset, control, setError, getValues, clearErrors, handleSubmit } = useForm<{
    mappings: IMappingFinalize[];
  }>();
  const {
    isFetched,
    isLoading,
    data: mappings,
  } = useQuery<IMapping[], IErrorObject, IMapping[], string[]>(
    [`mapping:${uploadInfo._id}`],
    () => api.getMappings(uploadInfo._id),
    {
      onSuccess(mappingsResponse) {
        logAmplitudeEvent('MAPPING', {
          totalKeys: mappingsResponse.length,
          totalRecords: uploadInfo.totalRecords,
          mappedKeys: mappingsResponse.filter((mapping) => mapping.columnHeading).length, // count how many keys are mapped
        });
        reset({
          mappings: mappingsResponse.map((mapping) => ({
            key: mapping.key,
            name: mapping.name,
            columnHeading: mapping.columnHeading,
          })),
        });
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      enabled: !!uploadInfo?._id,
    }
  );
  const { isUploadInfoLoading } = useUploadInfo({
    enabled: true,
    onNext(data) {
      setHeadings(
        data.headings.map((heading) => ({
          value: heading,
          label: heading,
        }))
      );
    },
  });
  const { isLoading: isMappingFinalizing, mutate: finalizeMapping } = useMutation<
    IUpload,
    IErrorObject,
    IMappingFinalize[],
    any
  >(
    [`mapping:${uploadInfo._id}-finalize`],
    (finalizedMappings) => api.finalizeMappings(uploadInfo._id, finalizedMappings),
    {
      onSuccess(updatedUploadInfo) {
        setUploadInfo(updatedUploadInfo);
        goNext();
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
    }
  );
  const onFinalizeMapping = (data: { mappings: IMappingFinalize[] }) => {
    const hasUnqieuHeadingErrors = validateUniqueHeadings();
    if (!hasUnqieuHeadingErrors) finalizeMapping(data.mappings);
  };
  const validateUniqueHeadings = () => {
    let hasErrors = false;
    const newMappings = getValues('mappings');
    const valuesMap = new Map<string, number>();
    newMappings.forEach((mapping) => {
      if (mapping.columnHeading) valuesMap.set(mapping.columnHeading, (valuesMap.get(mapping.columnHeading) || 0) + 1);
    });
    newMappings.forEach((mapping, idx) => {
      if ((valuesMap.get(mapping.columnHeading) || 0) > 1) {
        setError(`mappings.${idx}.columnHeading`, {
          type: 'custom',
          message: replaceVariablesInString(texts.PHASE2.ALREADY_MAPPED_MSG, {
            field: mapping.name,
            column: mapping.columnHeading,
          }),
        });
        hasErrors = true;
      } else {
        clearErrors(`mappings.${idx}.columnHeading`);
      }
    });

    return hasErrors;
  };

  return {
    control,
    mappings,
    headings,
    isMappingFinalizing,
    isUploadInfoLoading,
    validateUniqueHeadings,
    isInitialDataLoaded: isFetched && !isLoading,
    onSubmit: handleSubmit(onFinalizeMapping),
  };
}
