import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export const EmailRenderer = forwardRef<any, any>((props, ref) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value || undefined);

  useEffect(() => {
    refInput.current?.focus();
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  return <input type="email" ref={refInput} value={value} onChange={(event) => setValue(event.target.value)} />;
});
