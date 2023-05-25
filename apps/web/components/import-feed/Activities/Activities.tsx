import { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Flex, Title, Grid, Stack, useMantineColorScheme } from '@mantine/core';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';

import { Card } from '@ui/Card';
import { colors } from '@config';
import { ActivityGraphGlobalStyles } from './Graph.styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function Activities() {
  const dataLength = 0;
  const theme = useMantineColorScheme();
  const chartRef = useRef();

  return (
    <Stack spacing="md">
      <Title order={2}>Import Summary</Title>
      <Grid>
        <Grid.Col span={4}>
          <Card title="This Week" subtitle={300} color="primary" />
        </Grid.Col>
        <Grid.Col span={4}>
          <Card title="This Month" subtitle={760} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Card title="This Year" subtitle={1000} />
        </Grid.Col>
      </Grid>
      <Flex align="center" direction="column">
        <ActivityGraphGlobalStyles isDark={theme.colorScheme === 'dark'} isTriggerSent={!!dataLength} />
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
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Total Imports',
                // eslint-disable-next-line no-magic-numbers
                data: [10, 2, 50, 4, 41, 6.5, 7],
                backgroundColor: colors.blue,
              },
            ],
          }}
        />
      </Flex>
    </Stack>
  );
}
