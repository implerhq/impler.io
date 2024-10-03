import { Flex, Group, Stack } from '@mantine/core';
import { HotTableClass } from '@handsontable/react';
import { useEffect, useRef, useState } from 'react';

import { PhasesEnum } from '@types';
import { Button } from '@ui/Button';
import { MANUAL_ENTRY_LIMIT } from '@config';
import { WIDGET_TEXTS } from '@impler/client';
import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';
import { SegmentedControl } from '@ui/SegmentedControl';
import { useDataGrid } from '@hooks/DataGrid/useDataGrid';
import { useCompleteImport } from '@hooks/useCompleteImport';
import { FindReplaceModal } from 'components/widget/modals/FindReplace';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';
import { useBatchedUpdateRecord } from '@hooks/DataGrid/useBatchUpdateRecords';

interface IPhase12Props {
  onPrevClick: () => void;
  onNextClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function DataGrid({ onNextClick, onPrevClick, texts }: IPhase12Props) {
  const tableRef = useRef<HotTableClass>(null);
  const {
    type,
    columns,
    headings,
    reviewData,
    columnDefs,
    onTypeChange,
    reReviewData,
    totalRecords,
    setReviewData,
    frozenColumns,
    invalidRecords,
    isDoReviewLoading,
    isReviewDataLoading,
    showFindReplaceModal,
    setShowFindReplaceModal,
  } = useDataGrid({ limit: MANUAL_ENTRY_LIMIT });
  const { updateRecord } = useBatchedUpdateRecord({ onUpdate: reReviewData });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { completeImport, isCompleteImportLoading } = useCompleteImport({ onNext: onNextClick });
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });
  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height - 50,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  return (
    <>
      <Stack ref={tableWrapperRef} style={{ flexGrow: 1 }} spacing="xs" align="flex-start">
        <Flex direction="row" justify="space-between" w="100%">
          <SegmentedControl
            value={type}
            onChange={onTypeChange}
            items={[
              {
                value: 'all',
                label: replaceVariablesInString(texts.PHASE3.LABEL_ALL_RECORDS, {
                  records: numberFormatter(totalRecords),
                }),
              },
              {
                value: 'valid',
                label: replaceVariablesInString(texts.PHASE3.LABEL_VALID_RECORDS, {
                  records: numberFormatter(totalRecords - invalidRecords),
                }),
              },
              {
                value: 'invalid',
                label: replaceVariablesInString(texts.PHASE3.LABEL_INVALID_RECORDS, {
                  records: numberFormatter(invalidRecords),
                }),
              },
            ]}
          />
          <Group spacing="xs">
            <Button onClick={() => setShowFindReplaceModal(true)}>{texts.PHASE3.FIND_REPLACE}</Button>
          </Group>
        </Flex>
        <Table
          rowHeaders
          ref={tableRef}
          minSpareRows={1}
          data={reviewData}
          headings={headings}
          selectEnabled={false}
          columnDefs={columnDefs}
          onValueChange={(row, prop, oldVal, newVal) => {
            const name = String(prop).replace('record.', '');

            const currentData = [...reviewData];
            if (
              currentData &&
              currentData[row] &&
              oldVal != newVal &&
              !(oldVal === '' && newVal === undefined) &&
              !(newVal === '' && (oldVal === undefined || oldVal === null))
            ) {
              if (!currentData[row].updated) {
                currentData[row].updated = {};
              }
              if (!currentData[row].index) {
                currentData[row].index = row + 1;
              }
              currentData[row].record[name] = newVal === '' ? null : newVal;
              currentData[row].updated[name] = true;
              setReviewData(currentData);
              updateRecord({
                index: currentData[row].index,
                record: currentData[row].record,
                updated: currentData[row].updated,
              });
            }
          }}
          frozenColumns={frozenColumns}
          width={tableWrapperDimensions.width}
          height={tableWrapperDimensions.height}
        />
      </Stack>

      <Footer
        onPrevClick={onPrevClick}
        onNextClick={completeImport}
        active={PhasesEnum.MANUAL_ENTRY}
        primaryButtonLoading={isDoReviewLoading || isReviewDataLoading || isCompleteImportLoading}
        primaryButtonTooltip={invalidRecords > 0 ? texts['PHASE1-2'].FIX_INVALID_DATA : undefined}
        primaryButtonDisabled={invalidRecords > 0 || totalRecords === 0}
      />

      <FindReplaceModal
        texts={texts}
        columns={columns}
        opened={!!showFindReplaceModal}
        cancelLabel={texts.COMMON.CANCEL}
        replaceLabel={texts.PHASE3.REPLACE}
        refetchReviewData={reReviewData}
        onClose={() => setShowFindReplaceModal(false)}
      />
    </>
  );
}
