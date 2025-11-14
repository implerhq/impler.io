import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Title, Text, Stack, TextInput, Select, Radio, Group, Flex, Box, FocusTrap } from '@mantine/core';
import { Button } from '@ui/button';
import { useAppState } from 'store/app.context';
import { colors, COMPANY_SIZES, HOW_HEARD_ABOUT_US, PLACEHOLDERS, ROLES } from '@config';
import { Stepper } from '@components/Stepper/Stepper';
import { capitalizeFirstLetter } from '@shared/utils';

interface ProjectOnboardFormData {
  projectName: string;
  companySize: string;
  role: string;
  source: string;
}

interface ProjectOnboardFormProps {
  onSubmit: (data: ProjectOnboardFormData) => void;
  isLoading?: boolean;
}

export default function ProjectOnboardForm({ onSubmit, isLoading }: ProjectOnboardFormProps) {
  const { profileInfo } = useAppState();
  const [role] = useState(ROLES);
  const [about, setAbout] = useState(HOW_HEARD_ABOUT_US);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectOnboardFormData>({
    defaultValues: {
      projectName: `${capitalizeFirstLetter(profileInfo?.firstName ?? '')}'s Project`,
    },
  });

  return (
    <>
      <Title order={2} mb="md">
        <Group position="left" spacing="xs">
          <span style={{ fontSize: '30px' }}>👋</span>
          <span>Welcome {profileInfo?.firstName}</span>
        </Group>
      </Title>
      <Stepper currentStep={2} totalSteps={3} />
      <Text size="md" color="dimmed" align="left" mb="lg">
        Let&apos;s customize your experience. Your answers will decrease the time to get started.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FocusTrap active>
          <Stack spacing="md">
            <Controller
              name="projectName"
              control={control}
              rules={{
                // required: 'Project name is required',
                validate: {
                  noSpaces: (value) => value.trim().length > 0 || 'Project name cannot be empty or contain only spaces',
                },
              }}
              render={({ field }) => (
                <TextInput
                  required
                  label="Project Name"
                  placeholder={PLACEHOLDERS.project}
                  description="E.g. your company name or workspace name."
                  error={errors.projectName?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="companySize"
              control={control}
              rules={{ required: 'Company size is required' }}
              render={({ field }) => (
                <Radio.Group
                  name="companySize"
                  label="Company Size"
                  required
                  value={field.value}
                  onBlur={field.onBlur}
                  error={errors.companySize?.message}
                  onChange={field.onChange}
                >
                  <Flex gap="sm" wrap="wrap">
                    {COMPANY_SIZES.map((companySize) => (
                      <Box
                        key={companySize.value}
                        p="xs"
                        sx={() => ({
                          border: `1px solid ${colors.darkGrey}`,
                          borderRadius: '4px',
                        })}
                      >
                        <Radio name="companySize" size="xs" value={companySize.value} label={companySize.label} />
                      </Box>
                    ))}
                  </Flex>
                </Radio.Group>
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <Select
                  searchable
                  required
                  data={role}
                  label="Your Role"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.role?.message}
                  placeholder={PLACEHOLDERS.role}
                />
              )}
            />

            <Controller
              name="source"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Select
                  label="How did you hear about us first?"
                  required
                  data={about}
                  placeholder={PLACEHOLDERS.source}
                  searchable
                  creatable
                  value={field.value}
                  onChange={field.onChange}
                  getCreateLabel={(query) => `${query} (Other)`}
                  error={errors.source?.message}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setAbout((current) => [...current, item]);

                    return item;
                  }}
                />
              )}
            />

            <Button type="submit" fullWidth loading={isLoading}>
              Prepare your Import
            </Button>
          </Stack>
        </FocusTrap>
      </form>
    </>
  );
}
