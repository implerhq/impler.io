import { useOnboardUserProjectForm } from '@hooks/useOnboardUserProjectForm';
import { ProjectOnboardForm } from './ProjectOnboardForm';

interface ProjectOnboardFormData {
  projectName: string;
  companySize: string;
  role: string;
  source: string;
}

export function OnboardProjectForm() {
  const { onboardUser, isUserOnboardLoading } = useOnboardUserProjectForm({});

  const handleProjectOnboardFormSubmit = async (data: ProjectOnboardFormData) => {
    try {
      onboardUser(data);
    } catch (error) {}
  };

  return <ProjectOnboardForm isLoading={isUserOnboardLoading} onSubmit={handleProjectOnboardFormSubmit} />;
}
