import { AppLayout } from '@layouts/AppLayout';
import { ImportsList } from '@components/imports/ImportsList';
import { withProtectedResource } from '@components/hoc';
import { SubjectsEnum } from '@config';

const EnhancedImportsList = withProtectedResource(ImportsList, {
  subject: SubjectsEnum.IMPORTS,
});

export default function Imports() {
  return <EnhancedImportsList />;
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Imports',
    },
  };
}

Imports.Layout = AppLayout;
