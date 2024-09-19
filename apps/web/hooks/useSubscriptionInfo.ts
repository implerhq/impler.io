import { SelectItem } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';

import { COLUMN_TYPES } from '@config';

import { usePlanMetaData } from 'store/planmeta.store.context';

export function useSubscriptionInfo() {
  const { meta } = usePlanMetaData();
  const [columnTypes, setColumnType] = useState<SelectItem[]>([]);
  const getColumnTypes = useCallback(() => {
    if (!meta) return COLUMN_TYPES;

    return COLUMN_TYPES.map((item) => {
      if (item.label === 'Image' && item.value === 'Image' && !meta.IMAGE_UPLOAD) {
        return { ...item, disabled: true, label: 'Image - Scale Plan Feature' };
      }

      return item;
    });
  }, [meta]);

  useEffect(() => {
    setColumnType(getColumnTypes());
  }, [getColumnTypes]);

  return {
    columnTypes,
    advancedValidatorsUnavailable: !meta?.ADVANCED_VALIDATORS,
  };
}
