import { Group } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';

import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { MappingItem } from '@ui/MappingItem';
import { MappingHeading } from './MappingHeading';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';
import { useAutoImportPhase2 } from '../hooks/AutoImportPhase2/useAutoImportPhase2';
import { WIDGET_TEXTS } from '@impler/shared';

interface IAutoImportPhase2Props {
  onNextClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

const defaulWrappertHeight = 200;
export function AutoImportPhase2({ onNextClick, texts }: IAutoImportPhase2Props) {
  const { classes } = useStyles();
  const [wrapperHeight, setWrapperHeight] = useState(defaulWrappertHeight);
  const { control, mappings, onSubmit, onFieldSelect, headings } = useAutoImportPhase2({
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
                    />
                  )}
                />
              ))}
          </Group>
        </div>
      </div>

      <AutoImportFooter
        onNextClick={onSubmit}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.MAPCOLUMNS}
        texts={texts}
      />
    </>
  );
}
