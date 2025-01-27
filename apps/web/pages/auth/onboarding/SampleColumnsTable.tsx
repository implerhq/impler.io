import { DraggableTable } from '@ui/table';
import { ValidationsGroup } from '@components/imports/schema/ValidationsGroup';
import { sampleColumns } from '@config';
import { IColumn } from '@impler/shared';

export default function SampleColumnsTable() {
  return (
    <DraggableTable<IColumn>
      emptyDataText="No columns configured"
      headings={[
        {
          title: 'Name',
          key: 'name',
          width: '35%',
        },
        {
          title: 'Type',
          key: 'type',
          width: '15%',
        },
        {
          title: 'Validations',
          key: 'validations',
          width: '50%',
          Cell: (item) => <ValidationsGroup item={item} />,
        },
      ]}
      data={(sampleColumns as IColumn[]) || []}
      moveItem={() => {}}
    />
  );
}
