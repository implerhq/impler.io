import { useState } from 'react';
import { BaseEditor } from 'handsontable/editors';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notifier } from '@util';
import { variables } from '@config';
import { HotItemSchema } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { CellProperties } from 'handsontable/settings';
import {
  ColumnTypesEnum,
  ISchemaColumn,
  IErrorObject,
  IReviewData,
  IUpload,
  IRecord,
  ReviewDataTypesEnum,
} from '@impler/shared';

interface IUsePhase3Props {
  onNext: (uploadData: IUpload) => void;
}

const defaultPage = 1;

class SelectEditor extends BaseEditor {
  [x: string]: any;
  timer: any;
  focus() {
    this.selectInput.focus();
  }
  close() {
    this._opened = false;
    this.listDiv.classList.remove('open');
  }
  getValue() {
    return this.selectInput.value;
  }
  setValue(value) {
    this.selectInput.value = value;
  }
  open() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { top, start, width } = this.getEditedCellRect();
    this._opened = true;
    this.selectInput.focus();

    this.listDiv.classList.add('open');
    const selectStyle = this.listDiv.style;

    selectStyle.top = `${top}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
    selectStyle.margin = '0px';
  }
  prepare(
    row: number,
    column: number,
    prop: string | number,
    TD: HTMLTableCellElement,
    originalValue: any,
    cellProperties: CellProperties
  ): void {
    super.prepare(row, column, prop, TD, originalValue, cellProperties);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prepareOptions(this.cellProperties.selectOptions);
  }
  prepareOptions(options: string[], search?: string) {
    this.selectUl.innerHTML = '';

    if (!options || !options.length) return;

    if (search) {
      options = options.filter((key) => key.toLowerCase().includes(search.toLowerCase()));
    }

    options.forEach((key) => {
      const liElement = this.hot.rootDocument.createElement('li');
      liElement.classList.add('option');
      liElement.dataset.value = key;
      liElement.dataset.displayText = key;
      liElement.innerText = key;
      liElement.onclick = () => {
        this.selectInput.value = key;
        this.finishEditing();
      };
      this.selectUl.appendChild(liElement);
    });
  }
  search() {
    const text = this.selectInput.value;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prepareOptions(this.cellProperties.selectOptions, text);
  }
  init() {
    const listDiv = this.hot.rootDocument.createElement('div');
    listDiv.classList.add('list-wrapper');

    const input = this.hot.rootDocument.createElement('input');
    input.classList.add('dd-searchbox');
    input.type = 'search';
    input.onkeydown = () => {
      this.timer = setTimeout(() => {
        this.search();
      }, 200);
    };

    listDiv.appendChild(input);

    const listDropdownWrapper = this.hot.rootDocument.createElement('div');
    listDropdownWrapper.classList.add('list-dropdown');
    this.selectUl = this.hot.rootDocument.createElement('ul');
    listDropdownWrapper.appendChild(this.selectUl);
    listDiv.appendChild(listDropdownWrapper);

    this.listDiv = listDiv;
    this.selectInput = input;

    this.hot.rootElement.appendChild(this.listDiv);
  }
}

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const [page, setPage] = useState<number>(defaultPage);
  const [headings, setHeadings] = useState<string[]>([]);
  const { uploadInfo, setUploadInfo, host } = useAppState();
  const [reviewData, setReviewData] = useState<IRecord[]>([]);
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);
  const [type, setType] = useState<ReviewDataTypesEnum>(ReviewDataTypesEnum.ALL);
  const [showAllDataValidModal, setShowAllDataValidModal] = useState<boolean | undefined>(undefined);

  useQuery<unknown, IErrorObject, ISchemaColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id),
    {
      onSuccess(data) {
        const newColumnDefs: HotItemSchema[] = [];
        const newHeadings: string[] = ['#'];
        newColumnDefs.push({
          type: 'text',
          data: 'index',
          readOnly: true,
          editor: false,
          className: 'index-cell',
          disableVisualSelection: true,
        });
        data.forEach((column: ISchemaColumn) => {
          newHeadings.push(column.name);
          const columnItem: HotItemSchema = {
            className: 'htCenter',
            data: `record.${column.key}`,
            allowEmpty: !column.isRequired,
            allowDuplicate: !column.isUnique,
          };
          switch (column.type) {
            case ColumnTypesEnum.STRING:
            case ColumnTypesEnum.EMAIL:
            case ColumnTypesEnum.REGEX:
              columnItem.type = 'text';
              columnItem.renderer = 'custom';
              break;
            case ColumnTypesEnum.SELECT:
              columnItem.type = 'text';
              columnItem.editor = SelectEditor;
              columnItem.renderer = 'custom';
              columnItem.selectOptions = column.selectValues;
              break;
            case ColumnTypesEnum.NUMBER:
              columnItem.type = 'numeric';
              columnItem.renderer = 'custom';
              break;
            case ColumnTypesEnum.DATE:
              columnItem.type = 'date';
              if (column.dateFormats?.length) {
                columnItem.dateFormat = column.dateFormats[variables.baseIndex];
                columnItem.correctFormat = true;
              }

              columnItem.renderer = 'custom';
              break;
            default:
              columnItem.type = 'text';
              break;
          }
          newColumnDefs.push(columnItem);
        });
        newColumnDefs.push({
          type: 'text',
          data: 'record._id',
          readOnly: true,
          editor: false,
          renderer: 'del',
          className: 'del-cell',
          disableVisualSelection: true,
        });
        newHeadings.push('X');
        setHeadings(newHeadings);
        setColumnDefs(newColumnDefs);
      },
    }
  );
  const { refetch: fetchUploadInfo } = useQuery<IUpload, IErrorObject, IUpload, [string]>(
    [`getUpload:${uploadInfo._id}`],
    () => api.getUpload(uploadInfo._id),
    {
      enabled: false,
      onSuccess(data) {
        setUploadInfo(data);
        if (data.invalidRecords === variables.baseIndex && data.totalRecords) {
          setShowAllDataValidModal(true);
        }
      },
    }
  );
  const { mutate: refetchReviewData, isLoading: isReviewDataLoading } = useMutation<
    IReviewData,
    IErrorObject,
    [number, string],
    [string]
  >(
    ['review', page, type],
    ([reviewPageNumber, reviewDataType]) =>
      api.getReviewData({ uploadId: uploadInfo._id, page: reviewPageNumber, type: reviewDataType }),
    {
      cacheTime: 0,
      onSuccess(reviewDataResponse) {
        setReviewData(reviewDataResponse.data);
        if (!reviewDataResponse.data.length) {
          let newPage = page;
          if (reviewDataResponse.page > 1 && reviewDataResponse.totalPages < reviewDataResponse.page) {
            newPage = Math.max(1, Math.min(reviewDataResponse.page, reviewDataResponse.totalPages));
            setPage(newPage);
          } else {
            newPage = reviewDataResponse.page;
            setPage(newPage);
          }
          setTotalPages(Math.max(1, reviewDataResponse.totalPages));
          if (newPage !== page) refetchReviewData([newPage, type]);

          return;
        }
        logAmplitudeEvent('VALIDATE', {
          invalidRecords: reviewDataResponse.totalRecords,
        });
        setPage(reviewDataResponse.page);
        setTotalPages(reviewDataResponse.totalPages);
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
    }
  );

  const { refetch: reReviewData, isFetching: isDoReviewLoading } = useQuery<
    unknown,
    IErrorObject,
    void,
    [string, string]
  >([`review`, uploadInfo._id], () => api.doReivewData(uploadInfo._id), {
    cacheTime: 0,
    staleTime: 0,
    onSuccess() {
      fetchUploadInfo();
      refetchReviewData([page, type]);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { isLoading: isConfirmReviewLoading, mutate: confirmReview } = useMutation<
    IUpload,
    IErrorObject,
    void,
    [string]
  >([`confirm:${uploadInfo._id}`], () => api.confirmReview(uploadInfo._id), {
    onSuccess(uploadData) {
      logAmplitudeEvent('RECORDS', {
        type: 'invalid',
        host,
        records: uploadData.invalidRecords,
      });
      logAmplitudeEvent('RECORDS', {
        type: 'valid',
        host,
        records: uploadData.totalRecords - uploadData.invalidRecords,
      });
      setUploadInfo(uploadData);
      onNext(uploadData);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { mutate: updateRecord } = useMutation<unknown, IErrorObject, IRecord, [string]>([`update`], (record) =>
    api.updateRecord(uploadInfo._id, record)
  );
  const { mutate: deleteRecord, isLoading: isDeleteRecordLoading } = useMutation<
    unknown,
    IErrorObject,
    [number, boolean],
    [string]
  >([`delete`], ([index, isValid]) => api.deleteRecord(uploadInfo._id, index, isValid), {
    onSuccess(data, vars) {
      const newReviewData = reviewData.filter((record) => record.index !== vars[0]);
      const newUploadInfo = { ...uploadInfo };
      newUploadInfo.totalRecords = newUploadInfo.totalRecords - 1;
      if (!vars[1]) {
        newUploadInfo.invalidRecords = newUploadInfo.invalidRecords - 1;
      }
      setUploadInfo(newUploadInfo);
      setReviewData(newReviewData);
      if (newReviewData.length === 0) {
        refetchReviewData([getPrevPage(page), type]);
      }
    },
  });

  const getPrevPage = (currentPageNumber: number) => Math.max(currentPageNumber - 1, 1);

  const onTypeChange = (newType: ReviewDataTypesEnum) => {
    setType(newType);
    refetchReviewData([page, newType]);
  };
  const onPageChange = (newPageNumber: number) => {
    refetchReviewData([newPageNumber, type]);
  };

  return {
    page,
    type,
    headings,
    totalPages,
    columnDefs,
    reReviewData,
    updateRecord,
    onPageChange,
    onTypeChange,
    deleteRecord,
    setReviewData,
    isDoReviewLoading,
    isReviewDataLoading,
    showAllDataValidModal,
    isDeleteRecordLoading,
    isConfirmReviewLoading,
    setShowAllDataValidModal,
    reviewData: reviewData || [],
    onConfirmReview: confirmReview,
    totalRecords: uploadInfo.totalRecords ?? undefined,
    invalidRecords: uploadInfo.invalidRecords ?? undefined,
  };
}
