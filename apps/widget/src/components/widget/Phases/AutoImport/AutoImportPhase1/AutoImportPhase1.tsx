/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Stack, TextInput, Text } from '@mantine/core';
import { PhasesEnum } from '@types';
import { validateRssUrl } from '@util';
import { Footer } from 'components/Common/Footer';
import { useAutoImportPhase1 } from '@hooks/AutoImportPhase1/useAutoImportPhase1';
import { ProgressRing } from './ProgressRing';
import { ConfirmModal } from 'components/widget/modals/ConfirmModal';
import { WIDGET_TEXTS } from '@impler/client';
import { useState, useCallback, useEffect } from 'react';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
  onCloseClick: () => void;
  onRssParsingStart?: () => void;
  onRssParsingEnd?: () => void;
  onRegisterAbortFunction?: (abortFn: () => void) => void;
}

export function AutoImportPhase1({
  onNextClick,
  onRssParsingStart,
  onRssParsingEnd,
  onRegisterAbortFunction,
}: IAutoImportPhase1Props) {
  const { isGetRssXmlHeadingsLoading, progressPercentage, register, errors, onSubmit, abortOperation, canAbort } =
    useAutoImportPhase1({
      goNext: onNextClick,
    });

  // Register the abort function with the parent component
  useEffect(() => {
    if (canAbort && abortOperation && onRegisterAbortFunction) {
      onRegisterAbortFunction(abortOperation);
    }
  }, [canAbort, abortOperation, onRegisterAbortFunction]);

  // Notify parent component about RSS parsing status
  useEffect(() => {
    if (isGetRssXmlHeadingsLoading) {
      onRssParsingStart?.();
    } else {
      onRssParsingEnd?.();
    }
  }, [isGetRssXmlHeadingsLoading, onRssParsingStart, onRssParsingEnd]);

  // Show form view when not processing
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
        </Stack>
      )}

      <Footer onNextClick={onSubmit} active={PhasesEnum.CONFIGURE} primaryButtonLoading={isGetRssXmlHeadingsLoading} />
    </Stack>
  );
}
