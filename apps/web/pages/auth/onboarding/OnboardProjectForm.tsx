import { Container } from '@mantine/core';
import { useOnboardUserProjectForm } from '@hooks/useOnboardUserProjectForm';
import { ProjectOnboardForm } from './ProjectOnboardForm';

export function OnboardProjectForm() {
  const { onboardUser } = useOnboardUserProjectForm({});

  const handleProjectOnboardFormSubmit = async (data: ProjectOnboardFormData) => {
    try {
      onboardUser(data);
    } catch (error) {}
  };

  return (
    <Container size="md" p="md">
      <ProjectOnboardForm onSubmit={handleProjectOnboardFormSubmit} />
    </Container>
  );
}

export default OnboardProjectForm;
