import { MappingItem } from '@ui/MappingItem';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';
import { useEffect, useRef, useState } from 'react';
import { usePhase2 } from '@hooks/Phase2/usePhase2';
import { PhasesEum } from '@types';
import { Controller } from 'react-hook-form';
import { MappingHeading } from './MappingHeading';

interface IPhase2Props {
  onPrevClick: () => void;
  onNextClick: () => void;
}

const defaulWrappertHeight = 200;
export function Phase2(props: IPhase2Props) {
  const { classes } = useStyles();
  const { onPrevClick, onNextClick } = props;
  const [wrapperHeight, setWrapperHeight] = useState(defaulWrappertHeight);
  const { headings, mappings, control, onSubmit } = usePhase2({ goNext: onNextClick });
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
      <div style={{ flexGrow: 1 }} ref={wrapperRef}>
        {/* Heading */}
        <MappingHeading ref={titlesRef} />
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
                key={mappingItem._id}
                name={`mappings.${index}.columnHeading`}
                control={control}
                render={({ field }) => (
                  <MappingItem
                    key={mappingItem._id}
                    options={headings}
                    heading={mappingItem.column.name}
                    value={field.value}
                    onChange={field.onChange}
                    ref={field.ref}
                  />
                )}
              />
            ))}
        </div>
      </div>

      <Footer active={PhasesEum.MAPPING} onNextClick={onSubmit} onPrevClick={onPrevClick} />
    </>
  );
}
