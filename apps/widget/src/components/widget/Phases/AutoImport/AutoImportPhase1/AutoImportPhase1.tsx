import { Stack, TextInput } from '@mantine/core';
import { PhasesEnum } from '@types';
import { validateRssUrl } from '@util';
import { Footer } from 'components/Common/Footer';
import { useAutoImportPhase1 } from '@hooks/AutoImportPhase1/useAutoImportPhase1';
import { ProgressRing } from './ProgressRing';
import { ConfirmModal } from 'components/widget/modals/ConfirmModal';
import { WIDGET_TEXTS } from '@impler/client';
import { useState, useCallback } from 'react';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
}

export function AutoImportPhase1({ onNextClick }: IAutoImportPhase1Props) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const {
    isGetRssXmlHeadingsLoading,
    progressPercentage,
    register,
    errors,
    onSubmit,
    socket,
    leaveSession,
    sessionIdRef,
  } = useAutoImportPhase1({
    goNext: onNextClick,
  });

  const handleCleanup = useCallback(() => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    if (sessionIdRef.current) {
      leaveSession(sessionIdRef.current);
      sessionIdRef.current = null;
    }
  }, [socket, sessionIdRef, leaveSession]);

  const handleClose = (confirm: boolean) => {
    if (confirm) {
      // Reset form and close
      setShowCloseConfirm(false);
      handleCleanup();
      // Add any additional cleanup here if needed
    } else {
      setShowCloseConfirm(false);
    }
  };

  /*
   * const handleFormClose = () => {
   *   if (isGetRssXmlHeadingsLoading) {
   *     setShowCloseConfirm(true);
   *   }
   * };
   */

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

      <ConfirmModal
        opened={showCloseConfirm}
        onCancel={() => handleClose(false)}
        onConfirm={() => handleClose(true)}
        title={WIDGET_TEXTS.CLOSE_CONFIRMATION.TITLE}
        subTitle={WIDGET_TEXTS.CLOSE_CONFIRMATION.TITLE}
        confirmLabel={WIDGET_TEXTS.CLOSE_CONFIRMATION.CONFIRM_CLOSE}
        cancelLabel={WIDGET_TEXTS.CLOSE_CONFIRMATION.CANCEL_CLOSE}
      />
    </Stack>
  );
}
