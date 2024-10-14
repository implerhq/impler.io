import { Controller, useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { Stack, TextInput as Input, FocusTrap, Text, Group, useMantineTheme } from '@mantine/core';

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
  } = useForm<IUpdateTemplateData>({
    defaultValues: {
      integration: IntegrationEnum.REACT,
    },
  });

  return (
    <FocusTrap active>
      <form onSubmit={handleSubmit(onSubmit)} ref={focusTrapRef}>
        <Stack spacing="sm">
          <Input
            required
            data-autofocus
            label="Import Name"
            placeholder="Contacts"
            {...register('name', { required: 'Import name is required' })}
            error={errors.name?.message}
          />
          <Text size="sm" mb={0} fw={500} color={theme.colors.dark[0]}>
            Where do you want to integrate importer?
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
                    onClick={() => field.onChange(key)}
                    color={field.value === key ? 'blue' : 'grey'}
                    variant={field.value === key ? 'filled' : 'outline'}
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
