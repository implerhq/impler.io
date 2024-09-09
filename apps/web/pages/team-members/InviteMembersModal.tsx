import React from 'react';
import { Flex, Textarea, Select } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller } from 'react-hook-form';
import { useInviteMembersForm } from '@hooks/useInviteMembersForm';
import { INVITATION_FORM_ROLES } from '@config';
import { validateEmails } from '@shared/utils';

export function InviteMembersModal() {
  const { control, handleSubmit, errors, onSubmit } = useInviteMembersForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="emails"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Enter or paste one or more email addresses, separated by spaces or commas"
            placeholder="example@email.com, example@email.com"
            minRows={4}
            {...field}
            error={errors.emails ? errors.emails.message : undefined}
          />
        )}
        rules={{
          required: 'Email addresses are required',
          validate: validateEmails,
        }}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            dropdownPosition="flip"
            label="Role"
            placeholder="Select Role"
            data={INVITATION_FORM_ROLES}
            mt="md"
            {...field}
            error={errors.role ? errors.role.message : undefined}
            // Add styling if needed
          />
        )}
        rules={{ required: 'Role is required' }}
      />

      <Flex gap="sm" mt="lg">
        <Button type="button" fullWidth variant="outline">
          Cancel
        </Button>
        <Button type="submit" fullWidth color="blue">
          Send Invitation(s)
        </Button>
      </Flex>
    </form>
  );
}
