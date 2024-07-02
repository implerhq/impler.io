import JSZip from 'jszip';
import { FileWithPath } from '@mantine/dropzone';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useSample } from '@hooks/useSample';
import { useAppState } from '@store/app.context';
import { captureError, getObjectId } from '@util';
import { useTemplates } from '@hooks/useTemplates';
import { useImplerState } from '@store/impler.context';

interface UsePhase01Props {
  goToUpload: () => void;
}

export function usePhase01({ goToUpload }: UsePhase01Props) {
  const { setImportId, setImageSchema } = useAppState();
  const { templateId } = useImplerState();
  const imageSchemaRef = useRef<Map<string, Set<string>>>(new Map());
  const { onDownload } = useSample({ onDownloadComplete: goToUpload });
  const { templates, isTemplatesFetchedAfterMount, imageColumns } = useTemplates();
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const {
    getValues,
    register,
    control,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<{
    key: string;
    image: string;
    images: {
      image: File;
      key: string;
      dataUrl: string;
    }[];
  }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });
  const onImageSelect = (images: FileWithPath[]) => {
    const key = getValues('key');
    clearErrors('image');
    images.forEach((image) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (typeof e.target?.result === 'string' && !imageSchemaRef.current.get(key)?.has(image.name)) {
          append({
            image,
            key,
            dataUrl: e.target.result,
          });
          imageSchemaRef.current.set(key, new Set([...(imageSchemaRef.current?.get(key) || []), image.name]));
        } else {
          setError('image', { message: `Image "${image.name}" already exists for ${key}.` });
        }
      };
      reader.readAsDataURL(image);
    });
  };
  const convertMapToObject = (imagesMap: Map<any, any>) => {
    const obj = {};
    for (const [key, value] of imagesMap.entries()) {
      obj[key] = Array.from(value);
    }

    return obj;
  };
  const onGenerateTemplateClick = async () => {
    setIsDownloadInProgress(true);
    const zip = new JSZip();
    await Promise.all(
      fields.map(async (field) => {
        zip.file(field.image.name, field.image);
      })
    );
    const template = templates?.find((templateItem) => templateItem._id === templateId);
    if (template) {
      const importId = getObjectId();
      setImportId(importId);
      const imageSchema = JSON.stringify(convertMapToObject(imageSchemaRef.current));
      setImageSchema(imageSchema);
      onDownload({
        importId,
        template,
        imageSchema,
        images: fields.length ? zip : undefined,
      });
    } else captureError('Template not found while generating image template');
    setIsDownloadInProgress(false);
  };

  useEffect(() => {
    if (Array.isArray(imageColumns) && imageColumns.length) {
      setValue('key', imageColumns[0]);
    } else if (isTemplatesFetchedAfterMount) {
      goToUpload();
    }
  }, [imageColumns, isTemplatesFetchedAfterMount]);

  return {
    fields,
    errors,
    remove,
    control,
    register,
    imageColumns,
    onImageSelect,
    isDownloadInProgress,
    onGenerateTemplateClick,
  };
}
