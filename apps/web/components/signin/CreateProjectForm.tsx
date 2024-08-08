import { Controller, useForm } from 'react-hook-form';
import { Title, Text, Stack, TextInput, Select, Radio, Group, Container, Flex, Box } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, COMPANY_SIZES, HOW_HEARD_ABOUT_US, ROLES } from '@config';

import { useState } from 'react';
import { useOnboardUserProjectForm } from '@hooks/useOnboardUserProjectForm';
import { useApp } from '@hooks/useApp';

export default function CreateProjectForm() {
  const [role] = useState(ROLES);
  const [about, setAbout] = useState(HOW_HEARD_ABOUT_US);
  const { profile } = useApp();

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
        <Stack spacing="md" align="left">
          <Controller
            name="projectName"
            control={control}
            defaultValue=""
            rules={{ required: 'Project name is required' }}
            render={({ field }) => (
              <TextInput
                label="Project Name"
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
                label="Company Size"
                error={errors.companySize && errors.companySize.message}
                value={field.value}
                onChange={(value) => field.onChange(value as string)}
                onBlur={field.onBlur}
              >
                <Flex gap="sm">
                  {COMPANY_SIZES.map((companySize) => (
                    <Box
                      key={companySize.value}
                      p="xs"
                      sx={() => ({
                        border: `1px solid ${colors.darkGrey}`,
                      })}
                    >
                      <Radio size="xs" value={companySize.value} label={companySize.label} />
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
                label="Role"
                placeholder="Engineer, Manager, Founder..."
                data={role}
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />

          <Controller
            name="source"
            control={control}
            rules={{ required: 'How you heard about us is required' }}
            render={({ field }) => (
              <Select
                label="How did you hear about us first?"
                data={about}
                placeholder="Google Search, Colleague"
                searchable
                creatable
                value={field.value}
                onChange={field.onChange}
                getCreateLabel={(query) => `+Other ${query} `}
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
      </form>
    </Container>
  );
}
