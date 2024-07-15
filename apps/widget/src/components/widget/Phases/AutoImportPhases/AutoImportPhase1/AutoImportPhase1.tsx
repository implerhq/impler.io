import { TextInput, Text, Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Container } from 'components/Common/Container';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';
import { validateUrl } from '@util';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
}

interface FormValues {
  rssUrl: string;
}

export function AutoImportPhase1({ onNextClick }: IAutoImportPhase1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onNextClick();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text mt="sm" ml="md">
              RSS URL
            </Text>
            <TextInput
              maw="100%"
              placeholder="Enter the RSS URL"
              size="md"
              p="sm"
              style={{
                borderRadius: '10px',
                borderColor: errors.rssUrl ? 'red' : undefined,
              }}
              {...register('rssUrl', validateUrl)}
              error={errors.rssUrl && errors.rssUrl.message}
            />
            {errors.rssUrl && (
              <Text color="red" size="sm" mt="xs" ml="md">
                {errors.rssUrl.message}
              </Text>
            )}
          </div>

          <AutoImportFooter
            onNextClick={onNextClick}
            primaryButtonLoading={false}
            onPrevClick={() => {}}
            active={PhasesEnum.CONFIGURE}
          />
        </Stack>
      </form>
    </Container>
  );
}
