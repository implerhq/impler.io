import { useState } from 'react';
import { TEXTS } from '@config';
import { Select } from '@ui/Select';
import { Button } from '@ui/Button';
import { Dropzone } from '@ui/Dropzone';
import { Group } from '@mantine/core';
import { Download } from '@icons';
import useStyles from './Styles';
import { Footer } from 'components/Common/Footer';

interface IPhase1Props {
  onNextClick: () => void;
}

export function Phase1(props: IPhase1Props) {
  const { classes } = useStyles();
  const { onNextClick } = props;
  const [selectedFile, setSelectedFile] = useState<File>();

  return (
    <>
      <Group className={classes.templateContainer} spacing="lg" noWrap>
        <Select
          title={TEXTS.PHASE1.SELECT_TITLE}
          placeholder={TEXTS.PHASE1.SELECT_PLACEHOLDER}
          data={[{ value: 'Users', label: 'Users' }]}
          width="50%"
        />
        <div className={classes.download}>
          <Button size="sm" leftIcon={<Download />}>
            {TEXTS.PHASE1.DOWNLOAD_SAMPLE}
          </Button>
        </div>
      </Group>

      <Dropzone
        className={classes.dropzone}
        onDrop={(file) => setSelectedFile(file[0])}
        onClear={() => setSelectedFile(undefined)}
        title={TEXTS.PHASE1.SELECT_FILE}
        file={selectedFile}
      />

      <Footer onNextClick={onNextClick} onPrevClick={() => {}} active={1} />
    </>
  );
}
