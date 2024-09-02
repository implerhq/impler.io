import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Group, MantineSize, Popover, SelectItem, UnstyledButton } from '@mantine/core';

import useStyles from './CustomSelect.styles';
import { ChevronDownIcon } from '@assets/icons';
import { SelectedValue } from './SelectedValue';
import { CloseIcon } from '@assets/icons/Close.icon';
import { TooltipLink } from '@components/guide-point';

interface MultiSelectProps {
  label?: string;
  link?: string;
  size?: MantineSize;
  data: SelectItem[];
  placeholder?: string;
  description?: ReactNode;
  value?: string | number;
  onChange?: (value: string) => void;
}

export function CustomSelect({
  label,
  link,
  value,
  placeholder,
  data,
  size = 'sm',
  onChange,
  description,
}: MultiSelectProps) {
  const { classes } = useStyles({ size });
  const inputRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<any[]>([]);
  const [popoverOpened, setPopoverOpened] = useState<boolean>(false);

  useEffect(() => {
    let modifiedValue = value;
    if (typeof modifiedValue !== 'undefined') {
      if (typeof modifiedValue === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const contentData = data.filter((item) => modifiedValue.includes(item.value));
        contentData.forEach((item) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          modifiedValue = modifiedValue.replace(item.value, '');
        });
        setContent(contentData);
      }
      if (inputRef.current) {
        inputRef.current.innerText = String(modifiedValue);
      }
    }
  }, []);

  const selectItem = (item: SelectItem) => {
    if (inputRef.current) {
      setContent([item]);
      onChange?.(item.value);
      setPopoverOpened(false);
      inputRef.current.innerText = '';
    }
  };
  const onClear = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };
  const onChangeValue = (e: FormEvent<HTMLParagraphElement>) => {
    onChange?.(e.currentTarget.innerText);
  };
  const onSideBtnClick = () => {
    if (content.length === 0) {
      setPopoverOpened(!popoverOpened);
    } else {
      setContent([]);
    }
  };

  return (
    <Popover width="target" opened={popoverOpened} onClose={() => setPopoverOpened(false)} withinPortal>
      <Popover.Target>
        <div className={classes.root}>
          {label ? (
            <label className={classes.label}>
              <Group spacing="xs" align="center">
                {label}
                <TooltipLink link={link as string} />
              </Group>
            </label>
          ) : null}
          {description ? <p className={classes.description}>{description}</p> : null}
          <div className={classes.inputWrapper} data-haslabel={!!label}>
            <p
              ref={inputRef}
              spellCheck={false}
              onInput={onChangeValue}
              className={classes.input}
              data-placeholder={placeholder}
              contentEditable={content.length === 0}
              suppressContentEditableWarning={true}
            >
              {content.map((item, index) => (
                <SelectedValue
                  key={item.value}
                  label={item.label}
                  onRemove={() => onClear(index)}
                  disabled={false}
                  readOnly={false}
                  size="sm"
                  radius="xs"
                  variant="filled"
                  style={{
                    maxWidth: 'max-content',
                  }}
                />
              ))}
            </p>
            <UnstyledButton tabIndex={-1} className={classes.chevronButton} onClick={onSideBtnClick}>
              {content.length > 0 ? <CloseIcon /> : <ChevronDownIcon />}
            </UnstyledButton>
          </div>
        </div>
      </Popover.Target>
      <Popover.Dropdown className={classes.itemsWrapper}>
        {data.map((item) => (
          <div className={classes.item} key={item.value} onClick={() => selectItem(item)}>
            {item.label}
          </div>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
}
