import { colors } from '@config';

export function ErrorTooltip(props: any) {
  return (
    <div
      style={{
        padding: 15,
        fontSize: 14,
        borderRadius: 10,
        wordWrap: 'normal',
        backgroundColor: colors.red,
        color: colors.white,
      }}
    >
      {props.value}
    </div>
  );
}
