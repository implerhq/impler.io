import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';

import { notifier } from '@util';
import { useAPIState } from '@store/api.context';
import { useJobsInfo } from '@store/jobinfo.context';
import { useImplerState } from '@store/impler.context';
import { IUserJob, IErrorObject } from '@impler/shared';
import { IAutoImportValues } from '@types';
import { useAppState } from '@store/app.context';

interface IUseAutoImportPhase1Props {
  goNext: () => void;
}
interface FormValues {
  rssUrl: string;
}

export function useAutoImportPhase1({ goNext }: IUseAutoImportPhase1Props) {
  const { api } = useAPIState();
  const { setJobsInfo } = useJobsInfo();
  const { output, schema } = useAppState();
  const { templateId, extra, authHeaderValue } = useImplerState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { isLoading: isGetRssXmlHeadingsLoading, mutate: getRssXmlHeading } = useMutation<
    IUserJob,
    IErrorObject,
    IAutoImportValues,
    [string]
  >(['getRssXmlHeading'], (importData) => api.getRssXmlMappingHeading(importData) as Promise<IUserJob>, {
    onSuccess(data) {
      setJobsInfo(data);
      goNext();
    },
    onError(error) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    getRssXmlHeading({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      templateId: templateId!,
      url: data.rssUrl,
      authHeaderValue,
      extra,
      output,
      schema,
    });
  };

  return {
    errors,
    register,
    isGetRssXmlHeadingsLoading,
    onSubmit: handleSubmit(onSubmit),
  };
}
