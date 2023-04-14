import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/theme-monokai';
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';

export default function Editor({
  onChange,
  value,
  height = '300px',
  variables = [],
}: {
  onChange?: (value: string) => void;
  value?: string;
  height?: string;
  variables?: string[];
}) {
  addCompleter({
    getCompletions: function (_editor: any, _session: any, _pos: any, _prefix: any, callback: any) {
      callback(null, [
        ...variables.map((name) => {
          return { name, value: name, caption: name };
        }),
      ]);
    },
  });

  return (
    <AceEditor
      data-test-id="custom-code-editor"
      style={{ width: '100%' }}
      mode="json5"
      theme="monokai"
      name="codeEditor"
      onChange={onChange}
      height={height}
      fontSize={14}
      showPrintMargin
      showGutter
      highlightActiveLine
      value={value ? String(value) : ''}
      setOptions={{
        displayIndentGuides: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        newLineMode: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}
