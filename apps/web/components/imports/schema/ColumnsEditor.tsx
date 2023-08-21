import dynamic from 'next/dynamic';
import { Text } from '@mantine/core';
import { Controller } from 'react-hook-form';

import { Button } from '@ui/button';
import { SaveIcon } from '@assets/icons/Save.icon';
import { useColumnsEditor } from '@hooks/useColumnsEditor';
import { PossibleJSONErrors } from '@components/common/PossibleJsonErrors';

interface SchemaProps {
  templateId: string;
}

const Editor = dynamic(() => import('@ui/editor/Editor').then((mod) => mod.Editor), { ssr: false });

export function ColumnsEditor({ templateId }: SchemaProps) {
  const { onSaveColumnsClick, isUpdateColumsLoading, control, errors, columnErrors } = useColumnsEditor({
    templateId,
  });

  return (
    <>
      <Controller
        control={control}
        name="columns"
        render={({ field }) => (
          <Editor
            value={field.value}
            id="edit-columns"
            name="columns"
            maxLines={30}
            minLines={30}
            onChange={field.onChange}
          />
        )}
      />
      {errors.columns?.message && <Text color="red">{errors.columns.message}</Text>}
      {errors.columns?.type === 'JSON' && <PossibleJSONErrors />}
      {typeof columnErrors === 'object' &&
        Object.keys(columnErrors).map((key) => (
          <PossibleJSONErrors
            key={key}
            title={`Column ${key} has following errors:`}
            errors={columnErrors[key as unknown as number]}
          />
        ))}
      <Button onClick={onSaveColumnsClick} loading={isUpdateColumsLoading} leftIcon={<SaveIcon />}>
        Save
      </Button>
    </>
  );
}
