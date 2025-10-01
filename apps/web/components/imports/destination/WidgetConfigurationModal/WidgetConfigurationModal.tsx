import React from 'react';
import { Stack, Group, Text, TextInput as Input } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller, useForm } from 'react-hook-form';
import { ITemplate } from '@impler/shared';
import { Editor } from '@ui/editor';
import { TooltipLink } from '@components/guide-point';
import { DOCUMENTATION_REFERENCE_LINKS } from '@config';

interface WidgetConfigurationModalProps {
  template: ITemplate;
  onConfigSubmit: (config: { authHeaderValue?: string; extra?: string }) => void;
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
    register,
    formState: { errors },
  } = useForm<WidgetConfigFormData>({
    defaultValues: {
      authHeaderValue: '',
      extraData: '{"key": "value"}',
    },
  });

  const onSubmit = (data: WidgetConfigFormData) => {
    onConfigSubmit({
      authHeaderValue: data.authHeaderValue,
      extra: JSON.parse(data.extraData || '{}'),
    });
  };

  return (
    <Stack spacing="lg" style={{ minWidth: 400 }}>
      <Text color="dimmed">Add optional authentication headers and extra data for your webhook test</Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="sm">
          <Input
            placeholder="e.g., Bearer token123, your-api-key"
            error={errors.authHeaderValue?.message}
            label="Auth Header Value"
            description={
              <div style={{ marginTop: '4px' }}>
                The frontend SDK also lets you configure the Auth header and extra parameters.
                <TooltipLink label="Learn more" link={DOCUMENTATION_REFERENCE_LINKS.webhookAuthentication} />
              </div>
            }
            {...register('authHeaderValue')}
          />

          <Text size="sm" weight={500}>
            Extra Data (JSON or String)
          </Text>
          <Text size="xs" c="dimmed">
            Enter JSON data like {`{"key": "value"}`} or plain text like &quot;Hello&quot;
          </Text>
          <Controller
            name="extraData"
            control={control}
            defaultValue="Hello"
            rules={{
              validate: (value) => {
                if (!value) return true;

                const trimmed = value.trim();

                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                  try {
                    JSON.parse(value);

                    return true;
                  } catch {
                    return 'Invalid JSON format. Use valid JSON or plain text.';
                  }
                }

                return true;
              },
            }}
            render={({ field }) => (
              <Editor
                id="extra-data-editor"
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
          <Button type="submit" loading={isLoading}>
            Start Import
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
