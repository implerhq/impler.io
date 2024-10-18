import { Group } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';

import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { WIDGET_TEXTS } from '@impler/client';
import { MappingItem } from '@ui/MappingItem';
import { MappingHeading } from './MappingHeading';
import { Footer } from 'components/Common/Footer';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { useAutoImportPhase2 } from '@hooks/AutoImportPhase2/useAutoImportPhase2';

interface IAutoImportPhase2Props {
  onNextClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

const defaulWrappertHeight = 200;
export function AutoImportPhase2({ onNextClick, texts }: IAutoImportPhase2Props) {
  const { classes } = useStyles();
  const [wrapperHeight, setWrapperHeight] = useState(defaulWrappertHeight);
  const { control, mappings, onSubmit, onFieldSelect, headings, isCreateJobMappingLoading, isMappingsLoading } =
    useAutoImportPhase2({
      goNext: onNextClick,
    });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current && titlesRef.current) {
      setWrapperHeight(
        wrapperRef.current.getBoundingClientRect().height - titlesRef.current.getBoundingClientRect().height
      );
    }
  }, []);

  return (
    <>
      <LoadingOverlay visible={isMappingsLoading} />
      <div style={{ flexGrow: 1 }} ref={wrapperRef}>
        <MappingHeading texts={texts} ref={titlesRef} />
        <div
          className={classes.mappingWrapper}
          style={{
            height: wrapperHeight,
          }}
        >
          <Group align="center">
            {Array.isArray(mappings) &&
              mappings.map((column, index) => (
                <Controller
                  key={`${column._id}-${index}`}
                  name={`mappings.${index}.path`}
                  control={control}
                  render={({ field }) => (
                    <MappingItem
                      searchable
                      required={column.isRequired}
                      heading={column.name}
                      options={headings}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        onFieldSelect();
                      }}
                      ref={field.ref}
                      mappingNotDoneText={texts.PHASE2.MAPPING_NOT_DONE_TEXT}
                      mappingDoneText={texts.PHASE2.MAPPING_DONE_TEXT}
                      mappingPlaceholder={texts.PHASE2.MAPPING_FIELD_PLACEHOLDER}
                    />
                  )}
                />
              ))}
          </Group>
        </div>
      </div>

      <Footer onNextClick={onSubmit} active={PhasesEnum.MAPCOLUMNS} primaryButtonLoading={isCreateJobMappingLoading} />
    </>
  );
}
