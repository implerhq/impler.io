import { Controller } from 'react-hook-form';
import { useLocalStorage } from '@mantine/hooks';
import { Alert, Flex, Stack, Text } from '@mantine/core';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { Warning } from '@icons';
import { Select } from '@ui/Select';
import { PhasesEnum } from '@types';
import { WIDGET_TEXTS } from '@impler/client';
import { colors, variables } from '@config';
import { logAmplitudeEvent } from '@amplitude';
import { FileDropzone } from '@ui/FileDropzone';
import { Footer } from 'components/Common/Footer';
import { usePhase01 } from '@hooks/Phase0-1/usePhase01';
import { ImageWithIndicator } from '@ui/ImageWithIndicator';

interface Phase01Props {
  goToUpload: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function Phase01({ goToUpload, texts }: Phase01Props) {
  const [showAlert, setShowAlert] = useLocalStorage<boolean>({
    key: variables.SHOW_IMAGE_ALERT_STORAGE_KEY,
    defaultValue: true,
  });
  const {
    fields,
    errors,
    control,
    imageColumns,
    onImageSelect,
    onRemoveImage,
    isDownloadInProgress,
    onGenerateTemplateClick,
  } = usePhase01({ goToUpload });
  const wrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [containerHeight, setContainerHeight] = useState<number>(200);

  const onImageAlertClose = () => {
    setShowAlert(false);
    logAmplitudeEvent('HIDE_IMAGE_INFO');
  };

  useEffect(() => {
    setContainerHeight(wrapperRef.current.getBoundingClientRect().height);
  }, [showAlert]);

  return (
    <>
      <Stack style={{ flexGrow: 1 }}>
        <Flex gap="sm" direction="column">
          {showAlert && (
            <Alert
              color="blue"
              withCloseButton
              onClose={onImageAlertClose}
              title={texts['PHASE0-1'].IMAGE_INFO_TITLE}
              icon={<Warning fill={colors.primary} />}
            >
              {texts['PHASE0-1'].IMAGE_INFO_SUBTITLE}
            </Alert>
          )}
          <Controller
            control={control}
            name="key"
            render={({ field }) => (
              <Select
                data={imageColumns}
                value={field.value}
                title="Select Column"
                onChange={field.onChange}
                placeholder="Select Column"
              />
            )}
          />
        </Flex>
        <FileDropzone texts={texts} title="Upload Image" onDrop={onImageSelect} error={errors.image?.message} />
        <Stack ref={wrapperRef} style={{ flexGrow: 1, overflow: 'auto' }} h={containerHeight}>
          {Object.entries(
            fields.reduce((acc, field, index) => {
              if (Array.isArray(acc[field.key])) {
                acc[field.key].push(
                  <ImageWithIndicator
                    caption={field.image.name}
                    src={field.dataUrl}
                    key={field.image.name}
                    onCloseClick={() => onRemoveImage(index)}
                  />
                );
              } else {
                acc[field.key] = [
                  <ImageWithIndicator
                    caption={field.image.name}
                    src={field.dataUrl}
                    key={field.image.name}
                    onCloseClick={() => onRemoveImage(index)}
                  />,
                ];
              }

              return acc;
            }, {})
          ).map(([key, images]) => (
            <div key={key}>
              <Text>Uploaded Images for {key}</Text>
              <Flex wrap="wrap" gap="xs">
                {images as ReactNode[]}
              </Flex>
            </div>
          ))}
        </Stack>
      </Stack>
      <Footer
        active={PhasesEnum.IMAGE_UPLOAD}
        onNextClick={onGenerateTemplateClick}
        primaryButtonLoading={isDownloadInProgress}
      />
    </>
  );
}
