import { useEffect, useRef, useState } from 'react';
import { Group } from '@mantine/core';
import { PhasesEnum } from '@types';
import useStyles from './Styles';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';
import { MappingHeading } from './MappingHeading';
import { MappingItem } from '@ui/MappingItem';

interface IAutoImportPhase2Props {
  onNextClick: () => void;
}

export function AutoImportPhase2({ onNextClick }: IAutoImportPhase2Props) {
  const defaulWrappertHeight = 200;
  const { classes } = useStyles();
  const [wrapperHeight, setWrapperHeight] = useState(defaulWrappertHeight);

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
          <Group align="center">
            <MappingItem
              searchable
              required={true}
              heading={'Name'}
              options={[
                'feed > category > $ > term',
                'feed > category > $ > label',
                'feed > updated',
                'feed > id',
                'feed > link > $ > rel',
                'feed > link > $ > href',
                'feed > link > $ > type',
                'feed > title',
                'feed > entry > author > name',
                'feed > entry > author > uri',
                'feed > entry > category > $ > term',
                'feed > entry > category > $ > label',
                'feed > entry > content > _',
                'feed > entry > content > $ > type',
                'feed > entry > id',
                'feed > entry > media:thumbnail > $ > url',
                'feed > entry > link > $ > href',
                'feed > entry > updated',
                'feed > entry > published',
                'feed > entry > title',
              ]}
            />
            <MappingItem searchable required={true} heading={'Title'} options={['feed > category > title']} />
          </Group>
        </div>
      </div>

      <AutoImportFooter
        onNextClick={onNextClick}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.MAPCOLUMNS}
      />
    </>
  );
}
