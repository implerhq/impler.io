import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the subos-frontend App with client-side rendering only
const SubosApp = dynamic(() => import('subos-frontend/apps/frontend/dist/index/'), { ssr: false });

interface InactiveMembershipProps {
  showPlans: () => void;
}

export function InactiveMembership(_props: InactiveMembershipProps) {
  return <SubosApp />;
}
