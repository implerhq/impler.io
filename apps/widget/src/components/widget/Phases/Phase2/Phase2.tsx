import { Group, Text } from '@mantine/core';
import { MappingItem } from '@ui/MappingItem';
import { TEXTS } from '@config';
import { Footer } from 'components/Common/Footer';
import useStyles from './Styles';
import { useEffect, useRef, useState } from 'react';

interface IPhase2Props {
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Phase2(props: IPhase2Props) {
  const wrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const titlesRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [wrapperHeight, setWrapperHeight] = useState(200);
  const { classes } = useStyles();
  const { onPrevClick, onNextClick } = props;
  const options = [
    {
      label: 'Firstname',
      value: '1',
    },
    {
      label: 'Lastname',
      value: '2',
    },
  ];

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
        <Group style={{ justifyContent: 'space-between' }} noWrap ref={titlesRef}>
          <Group className={classes.textWrapper} align="stretch" noWrap>
            <Text color="dimmed" style={{ width: '50%' }}>
              {TEXTS.PHASE2.NAME_IN_SCHEMA_TITLE}
            </Text>
            <Text color="dimmed" style={{ width: '50%' }}>
              {TEXTS.PHASE2.NAME_IN_SHEET_TITLE}
            </Text>
          </Group>
        </Group>
        {/* Mapping Items */}
        <div
          className={classes.mappingWrapper}
          style={{
            height: wrapperHeight,
          }}
        >
          {Array.from({ length: 10 }).map((value, index) => (
            <MappingItem key={index} options={options} heading="First Name" />
          ))}
        </div>
      </div>

      <Footer active={2} onNextClick={onNextClick} onPrevClick={onPrevClick} />
    </>
  );
}
