import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { IErrorObject, IUserJobMapping } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useJobsInfo } from '@store/jobinfo.context';
import { notifier } from '@util';
import { keysToOmit } from '@config';

interface IUseAutoImportPhase2Props {
  goNext: () => void;
}

export function useAutoImportPhase2({ goNext }: IUseAutoImportPhase2Props) {
  const { api } = useAPIState();
  const { jobsInfo } = useJobsInfo();
  const [headings, setHeadings] = useState(
    jobsInfo?.headings.map((heading) => ({ value: heading, label: heading, disabled: false })) || []
  );
  const { control, handleSubmit, getValues, reset } = useForm<{ mappings: IUserJobMapping[] }>();
  const { isLoading: isMappingsLoading, data: mappings } = useQuery<
    IUserJobMapping[],
    IErrorObject,
    IUserJobMapping[],
    string[]
  >(['getUserJobMappings'], () => api.getUserJobMappings(jobsInfo?._id), {
    onSuccess(mappingsResponse) {
      const allHeadings = jobsInfo.headings.map((heading) => ({ value: heading, label: heading, disabled: false }));
      const filteredHeadings = allHeadings.filter((headingItem) => !keysToOmit.has(headingItem.value));

      setHeadings(filteredHeadings);

      reset({
        mappings: mappingsResponse.map((mapping) => ({
          key: mapping.key,
          name: mapping.name,
          path: mapping.path,
          isRequired: mapping.isRequired,
          _jobId: mapping._jobId,
        })),
      });
    },
  });

  const { mutate: createJobMapping } = useMutation<IUserJobMapping[], IErrorObject, IUserJobMapping[]>(
    (updateMappingData) => api.createUserJobMapings(jobsInfo._id, updateMappingData),
    {
      onSuccess() {
        goNext();
      },
      onError(error) {
        notifier.showError({ message: error.message, title: error.error });
      },
    }
  );

  const onSubmit = (data: any) => {
    createJobMapping(data.mappings);
  };

  const onFieldSelect = () => {
    const newMappings = getValues('mappings');
    const finalizedFields = newMappings.reduce((acc: string[], mappingItem) => {
      if (mappingItem.path) acc.push(mappingItem.path);

      return acc;
    }, []);
    const newHeadings = headings.map((headingItem) => ({
      ...headingItem,
      disabled: finalizedFields.includes(headingItem.value),
    }));
    setHeadings(newHeadings);
  };

  return {
    control,
    headings,
    mappings,
    isColumnLoading: isMappingsLoading,
    onSubmit: handleSubmit(onSubmit),
    onFieldSelect,
  };
}
