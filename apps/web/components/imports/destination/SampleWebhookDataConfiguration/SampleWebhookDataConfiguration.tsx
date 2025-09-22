import React from 'react';
import { Stack, Group, Text, TextInput as Input } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller } from 'react-hook-form';
import { useDestination } from '../../../../hooks/useDestination';
import { ITemplate } from '@impler/shared';
import { Editor } from '@ui/editor';

interface SampleWebhookDataConfigurationProps {
  templateId?: string;
  template: ITemplate;
}

export function SampleWebhookDataConfiguration({ template }: SampleWebhookDataConfigurationProps) {
  const { sampleWebhookForm, isSendSampleRequestLoading } = useDestination({ template });
  const { register, errors, control } = sampleWebhookForm;

  return (
    <Stack spacing="lg" style={{ minWidth: 400 }}>
      <Text size="sm" color="dimmed">
        Add optional authentication headers and extra data for your webhook test
      </Text>

      <form onSubmit={sampleWebhookForm.handleSubmit}>
        <Stack spacing="sm">
          <Input
            label="Auth Header Value"
            placeholder="e.g., Bearer token123, your-api-key"
            error={errors.authHeaderValue?.message}
            {...register('authHeaderValue')}
          />

          <div>
            <Text size="sm" weight={500} mb="xs">
              Extra Data
            </Text>
            <Controller
              name="extraData"
              control={control}
              defaultValue={`{
  "key": "value"
}`}
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
          </div>
        </Stack>

        <Group position="center" spacing="lg" style={{ marginTop: '24px' }}>
          <Button type="submit" loading={isSendSampleRequestLoading}>
            Send Test Webhook
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
