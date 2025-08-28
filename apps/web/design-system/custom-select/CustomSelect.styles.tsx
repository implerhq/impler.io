import { colors } from '@config';
import { createStyles, CSSObject, getSize, MantineSize, MantineTheme } from '@mantine/core';

const getInputWrapperStyles = (theme: MantineTheme): CSSObject => ({
  height: '2.25rem',
  display: 'flex',
  borderRadius: 0,
  paddingLeft: 'calc(2.25rem / 3)',
  border: `0.0625rem solid ${theme.colors.dark[4]}`,

  ':focus-within': {
    borderColor: theme.colors.blue[8],
  },
  backgroundColor: colors.BGPrimaryDark,
  '&[data-haslabel="true"]': {
    marginTop: 5,
  },
});
const getRootStyles = (): CSSObject => ({
  width: '100%',
  maxWidth: '100%',
  overflow: 'auto',
});
const getInputStyles = (theme: MantineTheme, size: MantineSize): CSSObject => ({
  flexGrow: 1,
  width: '100%',
  resize: 'none',
  outline: 'none',
  display: 'block',
  textAlign: 'left',
  overflow: 'hidden',
  appearance: 'none',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  borderRadius: '0.25rem',
  transition: 'border-color 100ms ease',
  lineHeight: 'calc(2.25rem - 0.125rem)',
  color: theme.colors.white,
  fontSize: getSize({ size, sizes: theme.fontSizes }),

  ':empty:before': {
    content: 'attr(data-placeholder)',
    pointerEvents: 'none',
    display: 'block',
    color: theme.colors.dark[3],
  },
});
const getSelectItemStyles = (theme: MantineTheme, size: MantineSize): CSSObject => ({
  ...theme.fn.fontStyles(),
  boxSizing: 'border-box',
  wordBreak: 'break-all',
  textAlign: 'left',
  width: '100%',
  padding: `calc(${getSize({ size, sizes: theme.spacing })} / 1.5) ${getSize({
    size,
    sizes: theme.spacing,
  })}`,
  cursor: 'pointer',
  fontSize: getSize({ size, sizes: theme.fontSizes }),
  color: theme.colors.dark[0],
  transition: 'background-color 0.3s ease-in-out',

  ':hover': {
    backgroundColor: theme.colors.dark[4],
  },
});
const getLabelStyles = (theme: MantineTheme): CSSObject => ({
  ...theme.fn.fontStyles(),
  fontWeight: 500,
  fontSize: getSize({ size: 'sm', sizes: theme.fontSizes }),
  color: theme.colors.dark[0],
});
const getSelectItemsWrapper = (): CSSObject => ({
  padding: 0,
  display: 'flex',
  overflow: 'auto',
  flexDirection: 'column',
  backgroundColor: colors.BGSecondaryDark,
});
const getChevronButtonStyles = (): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
});
const getDescriptionStyles = (theme: MantineTheme): CSSObject => ({
  fontSize: '0.75rem',
  color: theme.colors.gray[6],
});

interface Params {
  size: MantineSize;
}

export default createStyles(
  (theme: MantineTheme, params: Params): Record<string, any> => ({
    root: getRootStyles(),
    label: getLabelStyles(theme),
    description: getDescriptionStyles(theme),
    inputWrapper: getInputWrapperStyles(theme),
    chevronButton: getChevronButtonStyles(),
    input: getInputStyles(theme, params.size),
    itemsWrapper: getSelectItemsWrapper(),
    item: getSelectItemStyles(theme, params.size),
  })
);
