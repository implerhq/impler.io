import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { IColumn, IErrorObject } from '@impler/shared';
import { useSubscriptionMetaDataInformation } from './useSubscriptionMetaDataInformation';

interface UseUpdateBulkColumnsProps {
  templateId: string;
  onError?: (error: IErrorObject) => void;
}

export const useUpdateBulkColumns = ({ onError, templateId }: UseUpdateBulkColumnsProps) => {
  const {
    advancedValidationsUnavailable,
    freezeColumnsUnavailable,
    requiredValidationUnavailable,
    uniqueValidationUnavailable,
    dateFormatUnavailable,
  } = useSubscriptionMetaDataInformation();
  const queryClient = useQueryClient();

  const { mutate: updateColumnsInternal, isLoading: isUpdateColumsLoading } = useMutation<
    IColumn[],
    IErrorObject,
    Partial<IColumn>[],
    string[]
  >(
    [API_KEYS.TEMPLATE_COLUMNS_UPDATE, templateId],
    (data) => commonApi(API_KEYS.TEMPLATE_COLUMNS_UPDATE as any, { parameters: [templateId], body: data }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<IColumn[]>([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId], () => data);
        queryClient.invalidateQueries({ queryKey: [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId] });
        track({ name: 'BULK COLUMN UPDATE', properties: {} });
        notify('COLUMNS_UPDATED');
      },
      onError(error: IErrorObject) {
        notify(error.message + 'Hola');
        onError?.(error);
      },
    }
  );

  function checkImportConfig(columns: Partial<IColumn>[]) {
    for (const column of columns) {
      if (column.isRequired && requiredValidationUnavailable) {
        notify(NOTIFICATION_KEYS.SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN, {
          message: 'Required Validation',
        });

        return false;
      }

      if (column.isUnique && uniqueValidationUnavailable) {
        notify(NOTIFICATION_KEYS.SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN, {
          message: 'Unique Validation',
        });

        return false;
      }

      if (column.isFrozen && freezeColumnsUnavailable) {
        notify(NOTIFICATION_KEYS.SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN, {
          message: 'Freeze Columns',
        });

        return false;
      }

      if (advancedValidationsUnavailable || dateFormatUnavailable) {
        let featureName = '';

        switch (true) {
          case !!column.regex:
            featureName = 'Regex Validation';
            break;

          case !!column.allowMultiSelect:
            featureName = 'Multi-Select';
            break;

          case !!(column.selectValues && column.selectValues.length > 0):
            featureName = 'Select Values';
            break;
          case !!(column.dateFormats && column.dateFormats.length > 0):
            featureName = 'Date Formats';
            break;
          default:
            break;
        }

        if (featureName) {
          notify(NOTIFICATION_KEYS.SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN, {
            message: featureName,
          });

          return false;
        }
      }
    }

    return true;
  }
  function updateColumns(data: Partial<IColumn>[]) {
    if (!checkImportConfig(data)) {
      return;
    }
    updateColumnsInternal(data);
  }

  return { updateColumns, isUpdateColumsLoading };
};
