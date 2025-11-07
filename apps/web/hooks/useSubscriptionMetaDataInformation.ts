import { SelectItem } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';

import { COLUMN_TYPES } from '@config';

import { usePlanMetaData } from 'store/planmeta.store.context';

export function useSubscriptionMetaDataInformation() {
  const { meta } = usePlanMetaData();
  const [columnTypes, setColumnType] = useState<SelectItem[]>([]);
  const getColumnTypes = useCallback(() => {
    if (!meta) return COLUMN_TYPES;

    return COLUMN_TYPES.map((item) => {
      if (item.label === 'Image' && item.value === 'Image' && !meta.IMAGE_IMPORT) {
        return { ...item, disabled: true, label: 'Image - Premium Feature' };
      }

      return item;
    });
  }, [meta]);

  useEffect(() => {
    setColumnType(getColumnTypes());
  }, [getColumnTypes]);

  return {
    columnTypes,
    advancedValidationsUnavailable: !meta?.ADVANCED_VALIDATORS,
    freezeColumnsUnavailable: !meta?.FREEZE_COLUMNS,
    requiredValidationUnavailable: !meta?.REQUIRED_VALUES,
    uniqueValidationUnavailable: !meta?.UNIQUE_VALUES,
    defaultValueUnavailable: !meta?.DEFAULT_VALUES,
    dateFormatUnavailable: !meta?.DATE_FORMATS,
    bubbleIoIntegrationUnavailable: !meta?.BUBBLE_INTEGRATION,
    alternateColumnKeysUnavailable: !meta?.ALTERNATE_COLUMN_KEYS,
    multiSelectValuesUnavailable: !meta?.MULTI_SELECT_VALUES,
  };
}
