import { Group, Stack, Avatar, Text, Select } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { ExitIcon } from '@assets/icons/Exit.icon';

interface User {
  name: string;
  email: string;
  image: string;
}

interface Member {
  _id?: string;
  user: User;
  joinedDate: string;
  role: string;
  action: string;
}

const membersData: Member[] = [
  {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    joinedDate: '2023-01-01',
    role: 'Admin',
    action: 'Edit',
  },
  {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    joinedDate: '2023-02-15',
    role: 'Admin',
    action: 'Edit',
  },
  {
    user: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    joinedDate: '2023-03-10',
    role: 'Tech',
    action: 'Edit',
  },
  {
    user: {
      name: 'Alice Williams',
      email: 'alice@example.com',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    joinedDate: '2023-04-22',
    role: 'Finance',
    action: 'Edit',
  },
];

export function Members() {
  return (
    <Stack spacing="xs">
      <Stack spacing="sm">
        <Table<Member>
          headings={[
            {
              title: 'User',
              key: 'user',
              Cell: (member: Member) => (
                <Group spacing="sm">
                  <Avatar src={member.user.image} alt={member.user.name} />
                  <div>
                    <Text>{member.user.name}</Text>
                    <Text size="xs" color="dimmed">
                      {member.user.email}
                    </Text>
                  </div>
                </Group>
              ),
            },
            {
              title: 'Joined Date',
              key: 'joinedDate',
            },
            {
              title: 'Role',
              key: 'role',
              Cell: (member: Member) => (
                <Select
                  data={['Admin', 'Tech', 'Finance']}
                  maw={125}
                  value={member.role}
                  onChange={(value) => {
                    console.log('Updated role:', value);
                    alert(value);
                  }}
                />
              ),
            },
            {
              title: 'Action',
              key: 'action',
              Cell: () => <ExitIcon style={{ fontWeight: 'bolder' }} size="xl" />,
            },
          ]}
          data={membersData}
        />
      </Stack>
    </Stack>
  );
}

Members.Layout = AppLayout;
