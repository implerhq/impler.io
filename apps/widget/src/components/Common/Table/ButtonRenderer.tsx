import { Button } from '@ui/Button';

export const ButtonRenderer = ({ onClick, node }: any) => {
  return (
    <Button size="xs" color="red" onClick={() => onClick(node.data)}>
      x
    </Button>
  );
};
