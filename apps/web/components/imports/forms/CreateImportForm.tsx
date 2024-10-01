import { Controller, useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { Stack, TextInput as Input, FocusTrap, Divider, Text, Group, useMantineTheme } from '@mantine/core';
import { Button } from '@ui/button';

import { INTEGRATE_IMPORT } from '@config';
import { IntegrationEnum } from '@impler/shared';

interface CreateImportFormProps {
  onSubmit: (data: IUpdateTemplateData) => void;
}

export function CreateImportForm({ onSubmit }: CreateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const theme = useMantineTheme();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IUpdateTemplateData>({});

  return (
    <FocusTrap active>
      <form onSubmit={handleSubmit(onSubmit)} ref={focusTrapRef}>
        <Stack spacing="sm">
          <Divider mb="xs" />
          <Input
            label="Import Name"
            placeholder="Import title"
            data-autofocus
            required
            {...register('name', { required: 'Import name is required' })}
            error={errors.name?.message}
          />
          <Text size="sm" mb={0} fw={500} color={theme.colors.dark[0]}>
            How do you want to integrate importer?
          </Text>
          <Controller
            name="integration"
            control={control}
            rules={{ required: 'Please select an integration' }}
            defaultValue={IntegrationEnum.JAVASCRIPT}
            render={({ field }) => (
              <Group mt={0} spacing="sm">
                {INTEGRATE_IMPORT.map(({ name, Icon, key }) => (
                  <Button
                    key={key}
                    radius="xl"
                    leftIcon={<Icon />}
                    variant={field.value === key ? 'filled' : 'outline'}
                    onClick={() => field.onChange(key)}
                  >
                    {name}
                  </Button>
                ))}
              </Group>
            )}
          />
          {errors.integration && (
            <Text color="red" size="sm">
              {errors.integration.message}
            </Text>
          )}
          <Button type="submit" fullWidth>
            Create & Continue
          </Button>
        </Stack>
      </form>
    </FocusTrap>
  );
}
