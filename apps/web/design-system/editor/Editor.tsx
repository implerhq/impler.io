import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import { snippetCompleter } from 'ace-builds/src-noconflict/ext-language_tools';
import { useEffect, useMemo, useRef } from 'react';

interface EditorProps {
  id: string;
  name: string;
  mode?: 'json5' | 'javascript';
  height?: string;
  minLines?: number;
  maxLines?: number;
  readonly?: boolean;
  variables?: string[];
  highlightActiveLine?: boolean;
  onChange?: (value: string) => void;
  value?: string | Record<string, any>;
}

export function Editor({
  name,
  id,
  mode = 'json5',
  onChange,
  value,
  readonly,
  minLines,
  maxLines,
  highlightActiveLine = true,
  height = '300px',
  variables = [],
}: EditorProps) {
  const editorRef = useRef<any>();
  const completor = useMemo(
    () => ({
      getCompletions: function (_editor: any, _session: any, _pos: any, _prefix: any, callback: any) {
        callback(null, [
          ...variables.map((variableName) => {
            return { name: variableName, value: `"${variableName}"`, caption: `"${variableName}"` };
          }),
        ]);
      },
    }),
    [variables]
  );

  useEffect(() => {
    editorRef.current.editor.completers = [snippetCompleter, completor];
  }, [completor]);

  return (
    <AceEditor
      data-test-id={id}
      style={{ width: '100%' }}
      mode={mode}
      theme="monokai"
      name={name}
      ref={editorRef}
      onChange={onChange}
      height={height}
      fontSize={14}
      showPrintMargin
      showGutter
      highlightActiveLine={highlightActiveLine}
      readOnly={readonly}
      value={value ? String(value) : ''}
      minLines={minLines}
      maxLines={maxLines}
      wrapEnabled
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
