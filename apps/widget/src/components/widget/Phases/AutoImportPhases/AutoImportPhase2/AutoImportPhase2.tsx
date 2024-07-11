import { Text } from '@mantine/core';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';

interface IAutoImportPhase2Props {
  onNextClick: () => void;
}

export function AutoImportPhase2({ onNextClick }: IAutoImportPhase2Props) {
  return (
    <>
      <Text>This is Phase 2 Mapping</Text>
      <AutoImportFooter
        onNextClick={onNextClick}
        primaryButtonLoading={false}
        onPrevClick={() => {}}
        active={PhasesEnum.MAPCOLUMNS}
      />
    </>
  );
}
