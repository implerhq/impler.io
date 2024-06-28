import JSZip from 'jszip';
import { useRef, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import { useFieldArray, useForm } from 'react-hook-form';

import { useSample } from '@hooks/useSample';
import { captureError, getObjectId } from '@util';
import { useTemplates } from '@hooks/useTemplates';
import { useImplerState } from '@store/impler.context';

interface usePhase01Props {
  columns?: string[];
}

export function usePhase01({ columns }: usePhase01Props) {
  const { onDownload } = useSample();
  const { projectId, templateId } = useImplerState();
  const { templates } = useTemplates({ projectId });
  const imageSchemaRef = useRef<Map<string, Set<string>>>(new Map());
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const {
    getValues,
    register,
    control,
    setError,
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
  }>({
    defaultValues: {
      key: columns?.[0],
    },
  });
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
  const convertMapToObject = (myMap: Map<any, any>) => {
    const obj = {};
    for (const [key, value] of myMap.entries()) {
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
      const imageSchema = JSON.stringify(convertMapToObject(imageSchemaRef.current));
      console.log(imageSchema);
      onDownload({
        importId,
        template,
        imageSchema,
        images: fields.length ? zip : undefined,
      });
    } else captureError('Template not found while generating image template');
    setIsDownloadInProgress(false);
  };

  return {
    fields,
    errors,
    remove,
    control,
    register,
    onImageSelect,
    isDownloadInProgress,
    onGenerateTemplateClick,
  };
}
