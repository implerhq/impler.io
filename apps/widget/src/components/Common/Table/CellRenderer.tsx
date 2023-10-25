import { InvalidWarning } from '@ui/InvalidWarning';

export const CellRenderer = ({ node, column }: any) => {
  return node.data.isValid ? (
    node.data.record[column.colId]
  ) : (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {node.data.record[column.colId]}
      {!node.data.isValid && node.data.errors[column.colId] ? (
        <InvalidWarning label={node.data.errors[column.colId]} />
      ) : null}
    </div>
  );
};
