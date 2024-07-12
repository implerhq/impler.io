import { useEffect, useRef, useState } from 'react';
import { Group, Stack } from '@mantine/core';
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
      <Stack style={{ flexGrow: 1 }} ref={wrapperRef}>
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
            <Group align="center" noWrap>
              <MappingItem required={true} heading={'Geopolitics'} options={['Movies', 'World News']} />
            </Group>
          </div>
        </div>
      </Stack>

      <AutoImportFooter
        onNextClick={onNextClick}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.MAPCOLUMNS}
      />
    </>
  );
}
