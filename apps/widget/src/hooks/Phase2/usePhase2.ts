import { logAmplitudeEvent } from '@amplitude';
import { IMapping, IErrorObject, IMappingFinalize, IUpload } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notifier } from '@util';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IUsePhase2Props {
  goNext: () => void;
}

export function usePhase2({ goNext }: IUsePhase2Props) {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo } = useAppState();
  const [headings, setHeadings] = useState<
    {
      value: string;
      label: string;
      disabled?: boolean;
    }[]
  >(uploadInfo.headings.map((heading) => ({ value: heading, label: heading })));
  const { control, reset, handleSubmit } = useForm<{ mappings: IMappingFinalize[] }>();
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
        setHeadings(
          uploadInfo.headings.map((heading) => ({
            value: heading,
            label: heading,
            disabled: mappingsResponse.some((mapping) => mapping.columnHeading === heading),
          }))
        );
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
    }
  );
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
    finalizeMapping(data.mappings);
  };
  const onFieldSelect = (value: string) => {
    const newHeadings = [...headings];
    const index = newHeadings.findIndex((heading) => heading.value === value);
    newHeadings[index] = { ...newHeadings[index], disabled: true };
    setHeadings(newHeadings);
  };

  return {
    control,
    mappings,
    headings,
    onFieldSelect,
    isMappingFinalizing,
    isInitialDataLoaded: isFetched && !isLoading,
    onSubmit: handleSubmit(onFinalizeMapping),
  };
}
