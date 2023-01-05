import React from 'react';
import { saveAs } from 'file-saver';
import { Button } from '@impler/react';
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
  const { classes } = useStyles(showInvalidRecords);

  const onUploadComplete = (uploadData: IUpload) => {
    setUpload(uploadData);
    setPage(variables.ONE);
    setShowInvalidRecords(false);
    setTotalRecords(uploadData.validRecords);
    setHasInvalidRecords(uploadData.invalidRecords > variables.ZERO);
  };

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
        <Button
          projectId={PROJECT_ID}
          accessToken={ACCESS_TOKEN}
          template={TEMPLATE}
          primaryColor={PRIMARY_COLOR}
          className={classes.button}
          onUploadComplete={onUploadComplete}
        />
        {hasInvalidRecords && (
          <Switch
            label="Show Invalid Data"
            color="white"
            checked={showInvalidRecords}
            onChange={(e) => onShowInvalidChanges(e.target.checked)}
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
        Download Temperature Data
      </MantineButton>
    </div>
  );
};

export default Actions;
