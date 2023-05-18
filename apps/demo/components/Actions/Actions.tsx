import React, { useCallback } from 'react';
import { saveAs } from 'file-saver';
import { useImpler } from '@impler/react';
import { IUpload } from '@impler/shared';
import { constants, variables } from '@config';
import { useAppState } from '@context/app.context';
import { Button as MantineButton, Flex, Switch } from '@mantine/core';
import useStyles from './Styles';

interface ActionProps {
  PROJECT_ID: string;
  ACCESS_TOKEN?: string;
  TEMPLATE?: string;
  PRIMARY_COLOR?: string;
}

const Actions = ({ PROJECT_ID, ACCESS_TOKEN, PRIMARY_COLOR, TEMPLATE }: ActionProps) => {
  const {
    upload,
    setPage,
    setUpload,
    setHasInvalidRecords,
    hasInvalidRecords,
    showInvalidRecords,
    setShowInvalidRecords,
    setTotalRecords,
  } = useAppState();
  const onUploadComplete = useCallback(
    (uploadData: IUpload) => {
      setUpload(uploadData);
      setPage(variables.ONE);
      setShowInvalidRecords(false);
      setTotalRecords(uploadData.validRecords);
      setHasInvalidRecords(uploadData.invalidRecords > variables.ZERO);
    },
    [setHasInvalidRecords, setPage, setShowInvalidRecords, setTotalRecords, setUpload]
  );
  const { isImplerInitiated, showWidget } = useImpler({
    projectId: PROJECT_ID,
    accessToken: ACCESS_TOKEN,
    templateId: TEMPLATE,
    primaryColor: PRIMARY_COLOR,
    onUploadComplete: onUploadComplete,
  });
  const { classes } = useStyles(showInvalidRecords);

  const onShowInvalidChanges = (status: boolean) => {
    setShowInvalidRecords(status);
    setPage(variables.ONE);
    if (status) {
      setTotalRecords(upload!.invalidRecords);
    } else {
      setTotalRecords(upload!.validRecords);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Flex direction="row" align="center" gap="sm">
        <MantineButton onClick={showWidget} className={classes.button} disabled={!isImplerInitiated}>
          Import temperature data
        </MantineButton>
        {hasInvalidRecords && (
          <Switch
            label="Show Invalid Data"
            color="white"
            checked={showInvalidRecords}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onShowInvalidChanges(e.target.checked)}
            classNames={{
              root: classes.root,
              track: classes.track,
              label: classes.label,
            }}
          />
        )}
      </Flex>
      <MantineButton
        onClick={() => saveAs(constants.DATA_FILE_URL, constants.DATA_FILE_NAME)}
        className={classes.button}
      >
        Download sample data
      </MantineButton>
    </div>
  );
};

export default Actions;
