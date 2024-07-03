import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { DatePickerInput } from '@mantine/dates';
import { Flex, LoadingOverlay, Stack, Title } from '@mantine/core';

import { colors } from '@config';
import { UploadStatusEnum } from '@impler/shared';
import { useImportCount } from '@hooks/useImportCount';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export function ImportCount() {
  const { importCountData, isImportCountLoading, dates, setDates } = useImportCount();

  return (
    <Stack>
      <Flex direction="row" justify="space-between">
        <Title order={3}>Overall Imported Records</Title>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DatePickerInput placeholder="Pick dates range" type="range" value={dates} onChange={setDates} w={300} />
      </Flex>
      <div
        style={{
          height: 550,
          width: '100%',
          position: 'relative',
        }}
      >
        <LoadingOverlay visible={isImportCountLoading} />
        <Bar
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true,
                grid: {
                  color: colors.StrokeDark,
                },
                ticks: {
                  color: 'white',
                },
              },
              y: {
                stacked: true,
                grid: {
                  color: colors.StrokeDark,
                },
                ticks: {
                  color: 'white',
                },
              },
            },
          }}
          data={{
            labels: importCountData?.map((item) => item?.date) || [],
            datasets: [
              {
                label: UploadStatusEnum.COMPLETED,
                data: importCountData?.map((item) => item.records[UploadStatusEnum.COMPLETED]) || [],
                borderColor: colors.green,
                backgroundColor: colors.green,
              },
              {
                label: UploadStatusEnum.TERMINATED,
                // data: importCountData?.map((item) => item.records[UploadStatusEnum.TERMINATED]) || [],
                data: [1, 1, 65, 48, 56, 41],
                borderColor: colors.yellow,
                backgroundColor: colors.yellow,
              },
              {
                label: UploadStatusEnum.MAPPING,
                data: importCountData?.map((item) => item.records[UploadStatusEnum.MAPPING]) || [],
                borderColor: colors.blue,
                backgroundColor: colors.blue,
              },
            ],
          }}
        />
      </div>
    </Stack>
  );
}
