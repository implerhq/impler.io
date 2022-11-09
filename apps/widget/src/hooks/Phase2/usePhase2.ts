import { IMapping, IErrorObject, IMappingFinalize, IUpload } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

interface IUsePhase2Props {
  goNext: () => void;
}

export function usePhase2({ goNext }: IUsePhase2Props) {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo } = useAppState();
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
        reset({
          mappings: mappingsResponse.map((mapping) => ({
            _columnId: mapping.column._columnId,
            columnHeading: mapping.columnHeading,
          })),
        });
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
    }
  );
  const onFinalizeMapping = (data: { mappings: IMappingFinalize[] }) => {
    finalizeMapping(data.mappings);
  };

  return {
    control,
    mappings,
    isMappingFinalizing,
    headings: uploadInfo.headings,
    isInitialDataLoaded: isFetched && !isLoading,
    onSubmit: handleSubmit(onFinalizeMapping),
  };
}
