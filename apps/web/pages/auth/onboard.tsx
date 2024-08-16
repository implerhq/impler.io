import { OnboardLayout } from '@layouts/OnboardLayout';
import { OnboardUserForm } from '@components/signin/OnboardUserForm';

export default function Onboard() {
  return <OnboardUserForm />;
}

Onboard.Layout = OnboardLayout;
