import { ReactNode, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Flex, Stack, Text } from '@mantine/core';

import { Select } from '@ui/Select';
import { PhasesEnum } from '@types';
import { FileDropzone } from '@ui/FileDropzone';
import { Footer } from 'components/Common/Footer';
import { usePhase01 } from '@hooks/Phase0-1/usePhase01';
import { ImageWithIndicator } from '@ui/ImageWithIndicator';

const columns = ['Name', 'Email', 'Phone', 'Address', 'Date'];

export function Phase01() {
  const { fields, remove, control, onImageSelect, onGenerateTemplateClick, isDownloadInProgress, errors } = usePhase01({
    columns,
  });
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
                data={columns}
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
        onPrevClick={() => {}}
        active={PhasesEnum.IMAGE_UPLOAD}
        onNextClick={onGenerateTemplateClick}
        primaryButtonLoading={isDownloadInProgress}
      />
    </>
  );
}
