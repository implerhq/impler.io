import { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Flex, Title, Grid, Stack, useMantineColorScheme, LoadingOverlay } from '@mantine/core';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';

import { Card } from '@ui/Card';
import { VARIABLES, colors } from '@config';
import { useActivites } from '@hooks/useActivities';
import { ActivityGraphGlobalStyles } from './Graph.styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function Activities() {
  const { summaryData, isSummaryLoading } = useActivites();
  const theme = useMantineColorScheme();
  const chartRef = useRef();

  return (
    <Stack spacing="md">
      <Title order={2}>Import Summary</Title>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={isSummaryLoading} />
        <Grid mb="sm">
          <Grid.Col span={4}>
            <Card title="This Week" subtitle={summaryData?.weekly || VARIABLES.ZERO} color="primary" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Card title="This Month" subtitle={summaryData?.monthly || VARIABLES.ZERO} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Card title="This Year" subtitle={summaryData?.yearly || VARIABLES.ZERO} />
          </Grid.Col>
        </Grid>
        <Flex align="center" direction="column">
          <ActivityGraphGlobalStyles isDark={theme.colorScheme === 'dark'} isTriggerSent={true} />
          <Bar
            ref={chartRef}
            id="chart-bar-styles"
            style={{
              height: 350,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Chart.js Bar Chart',
                },
              },
              scales: {
                x: {
                  reverse: true,
                  grid: {
                    display: false,
                  },
                },
                y: {
                  display: false,
                },
              },
            }}
            data={{
              labels: summaryData?.uploads.map((upload) => upload.date) || [],
              datasets: [
                {
                  label: 'Total Imports',
                  // eslint-disable-next-line no-magic-numbers
                  data: summaryData?.uploads.map((upload) => upload.count) || [],
                  backgroundColor: colors.green,
                },
              ],
            }}
          />
        </Flex>
      </div>
    </Stack>
  );
}
