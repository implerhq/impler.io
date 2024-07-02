import { ReactNode, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Flex, Stack, Text } from '@mantine/core';

import { Select } from '@ui/Select';
import { PhasesEnum } from '@types';
import { FileDropzone } from '@ui/FileDropzone';
import { Footer } from 'components/Common/Footer';
import { usePhase01 } from '@hooks/Phase0-1/usePhase01';
import { ImageWithIndicator } from '@ui/ImageWithIndicator';

interface Phase01Props {
  goToUpload: () => void;
}

export function Phase01({ goToUpload }: Phase01Props) {
  const {
    fields,
    errors,
    remove,
    control,
    imageColumns,
    onImageSelect,
    isDownloadInProgress,
    onGenerateTemplateClick,
  } = usePhase01({ goToUpload });
  const wrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [containerHeight, setContainerHeight] = useState<number>(200);

  useEffect(() => {
    setContainerHeight(wrapperRef.current.getBoundingClientRect().height);
  }, []);

  return (
    <>
      <Stack style={{ flexGrow: 1 }}>
        <Flex gap="sm">
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
        <FileDropzone title="Upload Image" onDrop={onImageSelect} error={errors.image?.message} />
        <Stack ref={wrapperRef} style={{ flexGrow: 1, overflow: 'auto' }} h={containerHeight}>
          {Object.entries(
            fields.reduce((acc, field, index) => {
              if (Array.isArray(acc[field.key])) {
                acc[field.key].push(
                  <ImageWithIndicator src={field.dataUrl} key={field.image.name} onCloseClick={() => remove(index)} />
                );
              } else {
                acc[field.key] = [
                  <ImageWithIndicator src={field.dataUrl} key={field.image.name} onCloseClick={() => remove(index)} />,
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
        onPrevClick={goToUpload}
        active={PhasesEnum.IMAGE_UPLOAD}
        onNextClick={onGenerateTemplateClick}
        primaryButtonLoading={isDownloadInProgress}
      />
    </>
  );
}
