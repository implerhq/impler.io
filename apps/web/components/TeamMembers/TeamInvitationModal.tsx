import React, { useState } from 'react';
import { Flex, Select } from '@mantine/core';
import { Controller } from 'react-hook-form';

import { Button } from '@ui/button';
import { validateEmails } from '@shared/utils';
import { MultiSelect } from '@ui/multi-select';
import { INVITATION_FORM_ROLES, MODAL_KEYS } from '@config';
import { useProjectInvitationForm } from '@hooks/useProjectInvitationForm';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';
import { modals } from '@mantine/modals';

export function TeamInvitationModal() {
  const { refetchInvitations } = useSentProjectInvitations();
  const { control, handleSubmit, errors, onSubmit, isProjectInvitationLoading } = useProjectInvitationForm({
    refetchInvitations,
  });
  const [emailOptions, setEmailOptions] = useState<{ value: string; label: string }[]>([]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="invitationEmailsTo"
        control={control}
        render={({ field }) => (
          <>
            <MultiSelect
              label="Enter or paste one or more email addresses"
              data={emailOptions}
              placeholder="Select or add email addresses"
              nothingFound="Nothing found"
              searchable
              creatable
              getCreateLabel={(query) => `+ ${query}`}
              onCreate={(query) => {
                const item: any = { value: query, label: query };
                setEmailOptions((current) => [...current, item]);

                return item;
              }}
              error={errors.invitationEmailsTo ? errors.invitationEmailsTo.message : undefined}
              value={field.value || []}
              onChange={field.onChange}
              withinPortal
            />
          </>
        )}
        rules={{
          required: 'Email addresses are required',
          validate: (value) => {
            const emailValidationResult = validateEmails(value);
            if (emailValidationResult !== true) {
              return emailValidationResult;
            }
          },
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
            withinPortal
          />
        )}
        rules={{ required: 'Role is required' }}
      />

      <Flex gap="sm" mt="lg">
        <Button
          type="button"
          fullWidth
          variant="outline"
          onClick={() => {
            modals.close(MODAL_KEYS.INVITE_MEMBERS);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" fullWidth loading={isProjectInvitationLoading} color="blue">
          Send Invitation(s)
        </Button>
      </Flex>
    </form>
  );
}
