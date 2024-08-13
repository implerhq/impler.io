import { MappingItem } from '@ui/MappingItem';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';
import { useEffect, useRef, useState } from 'react';
import { usePhase2 } from '@hooks/Phase2/usePhase2';
import { WIDGET_TEXTS } from '@impler/shared';
import { PhasesEnum } from '@types';
import { Controller } from 'react-hook-form';
import { MappingHeading } from './MappingHeading';
import { LoadingOverlay } from '@ui/LoadingOverlay';

interface IPhase2Props {
  onPrevClick: () => void;
  onNextClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

const defaulWrappertHeight = 200;
export function Phase2(props: IPhase2Props) {
  const { classes } = useStyles();
  const { onPrevClick, onNextClick, texts } = props;
  const [wrapperHeight, setWrapperHeight] = useState(defaulWrappertHeight);
  const { headings, mappings, control, onSubmit, onFieldSelect, isInitialDataLoaded, isMappingFinalizing } = usePhase2({
    goNext: onNextClick,
  });
  const wrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const titlesRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    // setting wrapper height
    setWrapperHeight(
      wrapperRef.current.getBoundingClientRect().height - titlesRef.current.getBoundingClientRect().height
    );
  }, []);

  return (
    <>
      <LoadingOverlay visible={!isInitialDataLoaded || isMappingFinalizing} />
      <div style={{ flexGrow: 1 }} ref={wrapperRef}>
        {/* Heading */}
        <MappingHeading texts={texts} ref={titlesRef} />
        {/* Mapping Items */}
        <div
          className={classes.mappingWrapper}
          style={{
            height: wrapperHeight,
          }}
        >
          {Array.isArray(mappings) &&
            mappings.map((mappingItem, index) => (
              <Controller
                key={mappingItem.key}
                name={`mappings.${index}.columnHeading`}
                control={control}
                render={({ field }) => (
                  <MappingItem
                    key={mappingItem.key}
                    options={headings}
                    required={mappingItem.isRequired}
                    heading={mappingItem.name}
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
        </div>
      </div>

      <Footer
        primaryButtonLoading={isMappingFinalizing}
        active={PhasesEnum.MAPPING}
        onNextClick={onSubmit}
        onPrevClick={onPrevClick}
      />
    </>
  );
}
