import { useMutation } from '@tanstack/react-query';
import { IErrorObject, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

export function useWidget() {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();
  const { mutate: terminateUpload } = useMutation<IUpload, IErrorObject, void, string[]>(
    ['terminate', uploadInfo._id],
    () => api.terminateUpload(uploadInfo._id)
  );

  return {
    terminateUpload,
  };
}
