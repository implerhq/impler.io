import { Group, Text, Tooltip } from '@mantine/core';
import { Button } from '@ui/Button';
import { variables } from '@config';
import useStyles from './Styles';
import { FlowsEnum, PhasesEnum } from '@types';
import { useAppState } from '@store/app.context';

interface IFooterProps {
  active: PhasesEnum;
  primaryButtonTooltip?: string;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export function Footer({
  active,
  onNextClick,
  onPrevClick,
  primaryButtonTooltip,
  primaryButtonLoading,
  primaryButtonDisabled,
  secondaryButtonLoading,
  secondaryButtonDisabled,
}: IFooterProps) {
  const { classes } = useStyles();
  const { importConfig, texts, flow } = useAppState();

  const footerActions = {
    ...(flow === FlowsEnum.AUTO_IMPORT
      ? {
          [PhasesEnum.CONFIGURE]: (
            <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
              {texts.AUTOIMPORT_PHASE1.MAPCOLUMN}
            </Button>
          ),
          [PhasesEnum.MAPCOLUMNS]: (
            <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
              {texts.AUTOIMPORT_PHASE2.SCHEDULE}
            </Button>
          ),
          [PhasesEnum.SCHEDULE]: (
            <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
              {texts.AUTOIMPORT_PHASE3.CONFIRM}
            </Button>
          ),
          [PhasesEnum.CONFIRM]: (
            <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
              {texts.COMMON.CLOSE_WIDGET}
            </Button>
          ),
        }
      : flow === FlowsEnum.MANUAL_ENTRY
      ? {
          [PhasesEnum.MANUAL_ENTRY]: (
            <>
              <Button
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
                onClick={onPrevClick}
                variant="outline"
              >
                {texts.COMMON.UPLOAD_AGAIN}
              </Button>
              {primaryButtonTooltip ? (
                <Tooltip label={primaryButtonTooltip} withArrow>
                  <Button loading={primaryButtonLoading} visiblyDisabled={primaryButtonDisabled} onClick={onNextClick}>
                    {texts.COMMON.FINISH}
                  </Button>
                </Tooltip>
              ) : (
                <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
                  {texts.COMMON.FINISH}
                </Button>
              )}
            </>
          ),
        }
      : {
          [PhasesEnum.IMAGE_UPLOAD]: (
            <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
              {texts['PHASE0-1'].GENERATE_TEMPLATE}
            </Button>
          ),
          [PhasesEnum.SELECT_HEADER]: (
            <>
              <Button
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
                onClick={onPrevClick}
                variant="outline"
              >
                {texts.SELECT_HEADER.FILE_DONT_HAVE_HEADERS}
              </Button>
              <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
                {texts.SELECT_HEADER.CONFIRM_AND_CONTINUE}
              </Button>
            </>
          ),
          [PhasesEnum.MAPPING]: (
            <>
              <Button
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
                onClick={onPrevClick}
                variant="outline"
              >
                {texts.COMMON.UPLOAD_AGAIN}
              </Button>
              <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
                {texts.PHASE2.REVIEW_DATA}
              </Button>
            </>
          ),
          [PhasesEnum.REVIEW]: (
            <>
              <Button
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
                onClick={onPrevClick}
                variant="outline"
              >
                {texts.COMMON.UPLOAD_AGAIN}
              </Button>
              <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
                {texts.PHASE3.RE_REVIEW_DATA}
              </Button>
            </>
          ),
          [PhasesEnum.COMPLETE]: (
            <>
              <Button
                loading={secondaryButtonLoading}
                disabled={secondaryButtonDisabled}
                onClick={onPrevClick}
                variant="outline"
              >
                {texts.COMMON.CLOSE_WIDGET}
              </Button>
              <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
                {texts.COMMON.UPLOAD_AGAIN}
              </Button>
            </>
          ),
        }),
  };

  return (
    <Group className={classes.wrapper} spacing="xs">
      {importConfig && importConfig.showBranding === true ? (
        <a className={classes.poweredBy} href={variables.implerWebsite} target="_blank" rel="noopener noreferrer">
          <Text size="xs">
            Powered by <img src="/logo-full.png" className={classes.implerImage} />
          </Text>
        </a>
      ) : (
        <div />
      )}
      <Group spacing="xs">{footerActions[active]}</Group>
    </Group>
  );
}
