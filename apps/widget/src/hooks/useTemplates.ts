import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';

import { notifier } from '@util';
import { ITemplate, IErrorObject, ColumnTypesEnum, IColumn, DEFAULT_MAX_IMAGE_SIZE_MB } from '@impler/shared';

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

  const { data: templateColumns } = useQuery<unknown, IErrorObject, IColumn[], [string]>(
    [`template-columns:${templateId}`],
    () => api.getTemplateColun(templateId as string),
    {
      enabled: !!templateId && !schema,
    }
  );

  const parsedSchema = useMemo((): IColumn[] | undefined => {
    try {
      if (schema) {
        const parsed = JSON.parse(schema);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {}

    return undefined;
  }, [schema]);

  const imageColumns = useMemo((): string[] => {
    if (parsedSchema)
      return parsedSchema.reduce((acc, columnItem: IColumn) => {
        if (columnItem.type === ColumnTypesEnum.IMAGE) acc.push(columnItem.key);

        return acc;
      }, [] as string[]);

    const template = templates?.find((templateItem) => templateItem._id === templateId);

    return template?.imageColumns || [];
  }, [templates, templateId, parsedSchema]);

  const imageColumnMaxSizes = useMemo((): Record<string, number> => {
    const sizeMap: Record<string, number> = {};
    const source = parsedSchema || templateColumns;
    source?.forEach((columnItem) => {
      if (columnItem.type === ColumnTypesEnum.IMAGE) {
        sizeMap[columnItem.key] = columnItem.maxImageSize || DEFAULT_MAX_IMAGE_SIZE_MB;
      }
    });

    return sizeMap;
  }, [parsedSchema, templateColumns]);

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
    imageColumnMaxSizes,
    isTemplatesFetching,
    isTemplatesLoading,
    isTemplatesFetchedAfterMount,
    hasImageUpload: !!(Array.isArray(imageColumns) && imageColumns.length),
  };
}
