export type NotificationContent = { title: string; message: string };

export type HotItemSchema = {
  data: string;
  editor?: 'base' | 'select';
  validator?: 'numeric' | 'date' | 'base' | 'autocomplete' | 'text' | 'regex' | 'select';
  selectOptions?: string[];
  type?: 'text' | 'numeric' | 'date' | 'dropdown' | 'autocomplete';
  regex?: string;
  allowDuplicate?: boolean;
  allowEmpty?: boolean;
  allowInvalid?: boolean;
};
