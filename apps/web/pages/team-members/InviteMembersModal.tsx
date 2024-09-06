import { Textarea, Flex, Select } from '@mantine/core';
import { Button } from '@ui/button';

export function InviteMembersModal() {
  return (
    <>
      <Textarea
        placeholder="example@email.com, example@email.com"
        label="Enter or paste one or more email addresses, separated by spaces or commas"
        minRows={4}
      />

      <Select
        dropdownPosition="flip"
        label="Role"
        placeholder="Select Role"
        data={[
          { value: 'admin', label: 'Admin' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
        ]}
        mt="md"
      />

      <Flex gap="sm" mt="lg">
        <Button fullWidth variant="outline">
          Cancel
        </Button>
        <Button fullWidth color="blue">
          Send Invitation(s)
        </Button>
      </Flex>
    </>
  );
}
