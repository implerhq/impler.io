import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';

import { notifier } from '@util';
import { ITemplate, IErrorObject, ColumnTypesEnum, IColumn } from '@impler/shared';

export function useTemplates() {
  const { api } = useAPIState();
  const { schema, setTemplateInfo } = useAppState();
  const { templateId, projectId } = useImplerState();
  const {
    data: templates,
    isFetched: isTemplatesFetching,
    isLoading: isTemplatesLoading,
    isFetchedAfterMount: isTemplatesFetchedAfterMount,
  } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(
    ['templates', projectId],
    () => api.getTemplates(projectId),
    {
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      enabled: !!projectId,
      refetchOnMount: 'always',
    }
  );

  const imageColumns = useMemo((): string[] => {
    let parsedSchema;
    try {
      if (schema) parsedSchema = JSON.parse(schema);
    } catch (error) {}
    if (Array.isArray(parsedSchema))
      return parsedSchema.reduce((acc, columnItem: IColumn) => {
        if (columnItem.type === ColumnTypesEnum.IMAGE) acc.push(columnItem.key);

        return acc;
      }, [] as string[]);

    const template = templates?.find((templateItem) => templateItem._id === templateId);

    return template?.imageColumns || [];
  }, [templates, templateId, schema]);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = templates?.find((templateItem) => templateItem._id === templateId);
      if (foundTemplate) {
        setTemplateInfo(foundTemplate);
      }
    }
  }, [templates]);

  return {
    templates,
    imageColumns,
    isTemplatesFetching,
    isTemplatesLoading,
    isTemplatesFetchedAfterMount,
    hasImageUpload: !!(Array.isArray(imageColumns) && imageColumns.length),
  };
}
