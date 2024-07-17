import { Stack, TextInput } from '@mantine/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container } from 'components/Common/Container';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';
import { validateRssUrl } from '@util';
import { useAutoImportPhase1 } from '../hooks/AutoImportPhase1/useAutoImportPhase1';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
}

interface FormValues {
  rssUrl: string;
}

export function AutoImportPhase1({ onNextClick }: IAutoImportPhase1Props) {
  const { getRssXmlHeading, isLoading } = useAutoImportPhase1({
    goNext: onNextClick,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    getRssXmlHeading(data.rssUrl);
  };

  return (
    <Container>
      <Stack spacing="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="RSS URL"
            placeholder="Enter the RSS URL"
            size="md"
            {...register('rssUrl', validateRssUrl)}
            error={errors.rssUrl && errors.rssUrl.message}
          />
        </form>

        <AutoImportFooter
          onNextClick={handleSubmit(onSubmit)}
          primaryButtonLoading={isLoading}
          onPrevClick={() => {}}
          active={PhasesEnum.CONFIGURE}
        />
      </Stack>
    </Container>
  );
}
