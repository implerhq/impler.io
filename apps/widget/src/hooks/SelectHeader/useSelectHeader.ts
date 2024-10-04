import { useMutation, useQuery } from '@tanstack/react-query';

import { IUpload } from '@impler/client';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { IErrorObject, ISetHeaderData } from '@impler/shared';

interface IUseSelectHeaderProps {
  onNext: () => void;
}

export function useSelectHeader({ onNext }: IUseSelectHeaderProps) {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();

  const { data: previewRows, isLoading: isPreviewRowsLoading } = useQuery<unknown, IErrorObject, string[][]>(
    ['preview', uploadInfo._id],
    () => api.getDataPreview(uploadInfo._id) as Promise<string[][]>
  );

  const { mutate: setHeaderRow, isLoading: isSetHeaderRowLoading } = useMutation<IUpload, IErrorObject, ISetHeaderData>(
    ['set-header', uploadInfo._id],
    (setHeaderData) => api.setHeaderRow(uploadInfo._id, setHeaderData) as Promise<IUpload>,
    {
      onSuccess: onNext,
    }
  );

  return {
    previewRows,
    setHeaderRow,
    isPreviewRowsLoading,
    isSetHeaderRowLoading,
  };
}
