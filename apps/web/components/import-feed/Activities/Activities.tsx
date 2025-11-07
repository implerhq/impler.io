import { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Flex, Title, Grid, Stack, LoadingOverlay } from '@mantine/core';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';

import { Card } from '@ui/Card';
import { VARIABLES, colors } from '@config';
import { ImportStatistics } from '@components/home/ImportStatistics/ImportStatistics';
import { useSummary } from '@hooks/useActivities';
import { ActivityGraphGlobalStyles } from './Graph.styles';
import { Tabs } from '@ui/Tabs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function Activities() {
  const { summaryData, isSummaryLoading } = useSummary();
  const chartRef = useRef();
  const [activeTab, setActiveTab] = useState<'activityGraph' | 'importStatistics'>('activityGraph');

  return (
    <Stack spacing="md">
      <Tabs
        value={activeTab}
        onTabChange={(value) => setActiveTab(value as 'activityGraph' | 'importStatistics')}
        keepMounted={false}
        items={[
          {
            id: 'activityGraph',
            value: 'activityGraph',
            title: 'Activity Graph',
            content: <ActivityGraphGlobalStyles isTriggerSent={true} />,
          },
          {
            id: 'importStatistics',
            value: 'importStatistics',
            title: 'Import Statistics',
            content: <ImportStatistics />,
          },
        ]}
      />

      <Title order={3}>{activeTab === 'activityGraph' ? 'Activity Graph' : 'Import Statistics'}</Title>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={isSummaryLoading} />

        {activeTab === 'activityGraph' ? (
          <>
            <Grid mb="md">
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
              <ActivityGraphGlobalStyles isTriggerSent={true} />
              <Bar
                ref={chartRef}
                id="chart-bar-styles"
                style={{ height: 400 }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' as const },
                    title: {
                      display: true,
                      text: 'Total Imports',
                    },
                  },
                  scales: { x: { grid: { display: false } } },
                }}
                data={{
                  labels: summaryData?.uploads.map((upload) => upload.date) || [],
                  datasets: [
                    {
                      label: 'Total Imports',
                      data: summaryData?.uploads.map((upload) => upload.count) || [],
                      backgroundColor: colors.green,
                    },
                  ],
                }}
              />
            </Flex>
          </>
        ) : (
          <ImportStatistics />
        )}
      </div>
    </Stack>
  );
}
