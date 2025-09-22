import React from 'react';
import { Stack, Group, Text } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller, useForm } from 'react-hook-form';
import { ITemplate } from '@impler/shared';
import { Editor } from '@ui/editor';

interface WidgetConfigurationModalProps {
  template: ITemplate;
  onConfigSubmit: (config: { extra?: string }) => void;
  isLoading?: boolean;
}

interface WidgetConfigFormData {
  authHeaderValue?: string;
  extraData?: string;
}

export function WidgetConfigurationModal({ onConfigSubmit, isLoading }: WidgetConfigurationModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WidgetConfigFormData>({
    defaultValues: {
      authHeaderValue: '',
      extraData: `{
  "key": "value"
}`,
    },
  });

  const onSubmit = (data: WidgetConfigFormData) => {
    onConfigSubmit({
      extra: data.extraData,
    });
  };

  return (
    <Stack spacing="lg" style={{ minWidth: 400 }}>
      <Text size="sm" color="dimmed">
        Configure authentication and extra data for your import webhook
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="sm">
          <Text size="sm" weight={500} mb="xs">
            Extra Data (JSON or String)
          </Text>
          <Controller
            name="extraData"
            control={control}
            rules={{
              validate: (value) => {
                if (!value) return true;
                try {
                  JSON.parse(value);

                  return true;
                } catch {
                  return 'Please enter valid JSON';
                }
              },
            }}
            render={({ field }) => (
              <Editor
                id="widget-extra-data-editor"
                name="extraData"
                mode="json5"
                value={field.value || ''}
                onChange={field.onChange}
                height="200px"
                minLines={8}
                maxLines={15}
              />
            )}
          />
          {errors.extraData && (
            <Text size="xs" color="red" mt="xs">
              {errors.extraData.message}
            </Text>
          )}
        </Stack>

        <Group position="center" spacing="lg" style={{ marginTop: '24px' }}>
          <Button type="submit" loading={isLoading} fullWidth>
            Start Import
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
