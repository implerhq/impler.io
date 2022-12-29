import { variables } from '@config';
import { IUpload } from '@impler/shared';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface IAppContext {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  upload: IUpload | undefined;
  setUpload: (upload: IUpload) => void;
  setTotalRecords: (records: number) => void;
  hasInvalidRecords: boolean;
  showInvalidRecords: boolean;
  setPage: (page: number) => void;
  setLimit: (value: number) => void;
  setTotalPages: (page: number) => void;
  setHasInvalidRecords: (status: boolean) => void;
  setShowInvalidRecords: (status: boolean) => void;
}

const AppContext = createContext<IAppContext | null>(null);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [page, setPage] = useState<number>(variables.ZERO);
  const [limit, setLimit] = useState<number>(variables.DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState<number>(variables.ONE);
  const [hasInvalidRecords, setHasInvalidRecords] = useState<boolean>(false);
  const [showInvalidRecords, setShowInvalidRecords] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(variables.ZERO);
  const [upload, setUpload] = useState<IUpload | undefined>();

  return (
    <AppContext.Provider
      value={{
        page,
        limit,
        setPage,
        upload,
        setUpload,
        setLimit,
        totalPages,
        totalRecords,
        setTotalRecords,
        hasInvalidRecords,
        setHasInvalidRecords,
        showInvalidRecords,
        setShowInvalidRecords,
        setTotalPages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  return context;
};

export default AppContextProvider;
