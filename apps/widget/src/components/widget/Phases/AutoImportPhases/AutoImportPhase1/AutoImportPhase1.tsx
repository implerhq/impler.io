import { Stack, TextInput } from '@mantine/core';

import { PhasesEnum } from '@types';
import { validateRssUrl } from '@util';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';
import { useAutoImportPhase1 } from '../hooks/AutoImportPhase1/useAutoImportPhase1';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
}

export function AutoImportPhase1({ onNextClick }: IAutoImportPhase1Props) {
  const { isLoading, register, errors, onSubmit } = useAutoImportPhase1({
    goNext: onNextClick,
  });

  return (
    <Stack spacing="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
      <form onSubmit={onSubmit}>
        <TextInput
          size="md"
          label="RSS URL"
          placeholder="Enter the RSS URL"
          {...register('rssUrl', validateRssUrl)}
          error={errors.rssUrl && errors.rssUrl.message}
          styles={{
            input: {
              '&:-webkit-autofill': {
                WebkitTextFillColor: 'black !important',
                WebkitBoxShadow: '0 0 0 1000px white inset !important',
              },
            },
          }}
        />
      </form>

      <AutoImportFooter
        onNextClick={onSubmit}
        primaryButtonLoading={isLoading}
        onPrevClick={() => {}}
        active={PhasesEnum.CONFIGURE}
      />
    </Stack>
  );
}
