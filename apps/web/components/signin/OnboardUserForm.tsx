import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Title, Text, Stack, TextInput, Select, Radio, Group, Container, Flex, Box, FocusTrap } from '@mantine/core';

import { Button } from '@ui/button';
import { useApp } from '@hooks/useApp';
import { colors, COMPANY_SIZES, HOW_HEARD_ABOUT_US, ROLES } from '@config';
import { useOnboardUserProjectForm } from '@hooks/useOnboardUserProjectForm';

export function OnboardUserForm() {
  const { profile } = useApp();
  const [role] = useState(ROLES);
  const [about, setAbout] = useState(HOW_HEARD_ABOUT_US);

  const { onboardUser, isUserOnboardLoading } = useOnboardUserProjectForm();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IOnboardUserData>();

  const onSubmit = (formData: IOnboardUserData) => {
    onboardUser(formData);
  };

  return (
    <Container size="md" p="md">
      <Title mb="md">
        <Group position="left">
          <span style={{ fontSize: '30px' }}>👋</span>
          <span>Welcome, {profile?.firstName}</span>
        </Group>
      </Title>
      <Text size="md" color="dimmed" align="left" mb="lg">
        We just need to confirm a couple of details, it&lsquo;s only take a minute.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FocusTrap active>
          <Stack spacing="md" align="left">
            <Controller
              name="projectName"
              control={control}
              rules={{ required: 'Project name is required' }}
              render={({ field }) => (
                <TextInput
                  label="Project Name"
                  required
                  placeholder="Enter Your Project Name"
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
                  error={errors.companySize && errors.companySize.message}
                  onChange={(value) => field.onChange(value as string)}
                >
                  <Flex gap="sm" wrap="wrap">
                    {COMPANY_SIZES.map((companySize) => (
                      <Box
                        key={companySize.value}
                        p="xs"
                        sx={() => ({
                          border: `1px solid ${colors.darkGrey}`,
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
                  placeholder="Engineer, Manager, Founder..."
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
                  placeholder="Google Search, Colleague"
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

            <Button type="submit" fullWidth loading={isUserOnboardLoading}>
              Continue
            </Button>
          </Stack>
        </FocusTrap>
      </form>
    </Container>
  );
}
