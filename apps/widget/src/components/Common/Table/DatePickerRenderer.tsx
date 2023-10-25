import moment from 'moment';
import DatePicker from 'react-datepicker';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export const DatePickerRenderer = forwardRef<any, any>((props, ref) => {
  const [editing, setEditing] = useState(true);
  const [date, setDate] = useState(props.value ? moment(props.value, 'DD MM YYYY').toDate() : null);

  useEffect(() => {
    if (!editing) {
      props.api.stopEditing();
    }
  }, [editing]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return moment(date).format('DD/MM/YYYY');
      },
    };
  });

  const onChange = (selectedDate) => {
    setDate(selectedDate);
    setEditing(false);
  };

  return (
    <DatePicker
      portalId="root"
      popperClassName="ag-custom-component-popup"
      selected={date}
      dateFormat="dd/MM/yyyy"
      onChange={onChange}
    />
  );
});
