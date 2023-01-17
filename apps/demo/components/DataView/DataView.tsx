import { useState, useRef, useEffect } from 'react';
import Table from '@components/Table';
import { useQuery } from 'react-query';
import { colors, variables } from '@config';
import Pagination from '@components/Pagination';
import { useAppState } from '@context/app.context';
import { PaginationResult } from '@impler/shared';
import { useAPIState } from '@context/api.context';
import { LoadingOverlay } from '@mantine/core';
import useStyles from './Styles';

const DataView = () => {
  const { api } = useAPIState();
  const { classes } = useStyles();
  const [tempretureData, setTempretureData] = useState<ITempreture[]>([]);
  const { limit, page, setPage, totalPages, setTotalPages, upload, showInvalidRecords, setLimit, totalRecords } =
    useAppState();
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { isLoading } = useQuery<PaginationResult, IErrorObject, PaginationResult, any[]>(
    [upload, page, limit, showInvalidRecords],
    () =>
      showInvalidRecords
        ? api.getInvalidUploadedRows(upload!._id, page, limit)
        : api.getValidUploadedRows(upload!._id, page, limit),
    {
      enabled: !!upload,
      onSuccess: (response: PaginationResult) => {
        setTempretureData(response.data);
        setTotalPages(response.totalPages);
      },
    }
  );

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  const onLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(variables.ONE);
  };

  return (
    <div
      className={classes.root}
      ref={tableWrapperRef}
      style={{
        height: tableWrapperDimensions.height,
        overflow: 'auto',
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayBlur={2}
        overlayColor={colors.lightGray}
        loaderProps={{ color: colors.goldenrod }}
      />
      <Table
        data={tempretureData}
        headings={[
          { label: 'Month', key: 'month' },
          { label: 'Day', key: 'day' },
          { label: 'Average Temperature', key: 'AverageTemperatureFahr' },
          { label: 'Average Temperature Uncertainty', key: 'AverageTemperatureUncertaintyFahr' },
          { label: 'City', key: 'City' },
          { label: 'Country ID', key: 'country_id' },
          { label: 'Country', key: 'Country' },
          { label: 'Latitude', key: 'Latitude' },
          { label: 'Longitude', key: 'Longitude' },
        ]}
        emptyMessage="Nothing to show! Click on Import to import and see records."
      />
      <Pagination
        dataLength={tempretureData.length}
        limit={limit}
        onLimitChange={onLimitChange}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default DataView;
