import { Controller, useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { Stack, TextInput as Input, FocusTrap, Divider, Text, Group } from '@mantine/core';
import { Button } from '@ui/button';

import { INTEGRATE_IMPORT } from '@config';

interface CreateImportFormProps {
  onSubmit: (data: IUpdateTemplateData) => void;
}

export function CreateImportForm({ onSubmit }: CreateImportFormProps) {
  const focusTrapRef = useFocusTrap();
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
          <Text mb={0}>Where do you want to integrate import?</Text>
          <Controller
            name="integration"
            control={control}
            rules={{ required: 'Please select an integration' }}
            render={({ field }) => (
              <Group mt={0} spacing="sm">
                {INTEGRATE_IMPORT.map(({ name, Icon, key }) => (
                  <Button
                    key={key}
                    leftIcon={<Icon />}
                    radius="xl"
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
