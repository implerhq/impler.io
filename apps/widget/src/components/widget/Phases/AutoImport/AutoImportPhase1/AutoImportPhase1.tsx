import { Stack, TextInput, Text } from '@mantine/core';
import { validateRssUrl } from '@util';
import { PhasesEnum } from '@types';
import { Footer } from 'components/Common/Footer';
import { useAutoImportPhase1 } from '@hooks/AutoImportPhase1/useAutoImportPhase1';
import { ProgressRing } from './ProgressRing';
import { colors } from '@config';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
  onCloseClick: () => void;
  onRssParsingStart?: () => void;
  onRssParsingEnd?: () => void;
  onRegisterAbortFunction?: (abortFn: () => void) => void;
  onRegisterDisconnectFunction?: (disconnectFn: () => void) => void;
}

export function AutoImportPhase1({
  onNextClick,
  onRssParsingStart,
  onRssParsingEnd,
  onRegisterAbortFunction,
  onRegisterDisconnectFunction,
}: IAutoImportPhase1Props) {
  const { isGetRssXmlHeadingsLoading, progressPercentage, register, errors, onSubmit, texts } = useAutoImportPhase1({
    goNext: onNextClick,
    onRegisterAbortFunction,
    onRegisterDisconnectFunction,
    onRssParsingStart,
    onRssParsingEnd,
  });

  return (
    <Stack spacing="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
      <form onSubmit={onSubmit}>
        <TextInput
          disabled={isGetRssXmlHeadingsLoading}
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

      {isGetRssXmlHeadingsLoading && (
        <Stack align="center" justify="center" spacing="xl">
          <ProgressRing percentage={progressPercentage} />
          <Text fw="bolder" color={colors.StrokeLight}>
            {texts.AUTOIMPORT_PHASE1.CLOSE_CONFIRMATION.TITLE}
          </Text>
        </Stack>
      )}

      <Footer onNextClick={onSubmit} active={PhasesEnum.CONFIGURE} primaryButtonLoading={isGetRssXmlHeadingsLoading} />
    </Stack>
  );
}
