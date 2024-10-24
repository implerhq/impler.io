import React, { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { Controller } from 'react-hook-form';
import { Alert, Flex, Select, Stack, Text, Skeleton } from '@mantine/core';

import { Button } from '@ui/button';
import { MultiSelect } from '@ui/multi-select';
import { validateEmails } from '@shared/utils';
import { InformationIcon } from '@assets/icons/Information.icon';
import { INVITATION_FORM_ROLES, MODAL_KEYS } from '@config';
import { useProjectInvitationForm } from '@hooks/useProjectInvitationForm';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';

export function TeamInvitationModal() {
  const { refetchInvitations } = useSentProjectInvitations();
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isProjectInvitationLoading,
    teamTeamMemberMeta,
    refetchTeamMemberMeta,
    isTeamMemberMetaLoading,
  } = useProjectInvitationForm({
    refetchInvitations,
  });
  const [emailOptions, setEmailOptions] = useState<{ value: string; label: string }[]>([]);
  const availableInvites = teamTeamMemberMeta?.available;

  useEffect(() => {
    refetchTeamMemberMeta();
  }, [refetchTeamMemberMeta]);

  console.log('avail', availableInvites);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="lg">
        {isTeamMemberMetaLoading ? (
          <Skeleton height={20} radius="md" />
        ) : (
          <Alert color={teamTeamMemberMeta?.available ? 'yellow' : 'red'} variant="outline" icon={<InformationIcon />}>
            <Text>
              {availableInvites! > 0 ? (
                <>
                  You can invite <b>{availableInvites}</b> more member(s) in your current plan.
                </>
              ) : (
                <>You have reached the maximum number of invitations for your current plan.</>
              )}
            </Text>
          </Alert>
        )}
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
                required
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
                disabled={availableInvites! <= 0}
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

              if (Array.isArray(value) && value.length > availableInvites!) {
                return `You've only ${availableInvites} member seat(s) left in your current plan`;
              }

              return true;
            },
          }}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              required
              dropdownPosition="flip"
              label="Role"
              placeholder="Select Role"
              data={INVITATION_FORM_ROLES}
              {...field}
              error={errors.role ? errors.role.message : undefined}
              withinPortal
              disabled={availableInvites! <= 0}
            />
          )}
          rules={{ required: 'Please select role of the member(s)' }}
        />

        <Flex gap="sm">
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
          <Button
            fullWidth
            color="blue"
            type="submit"
            disabled={availableInvites! <= 0}
            loading={isProjectInvitationLoading || isTeamMemberMetaLoading}
          >
            Send Invitation(s)
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
