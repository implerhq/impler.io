import AceEditor from 'react-ace';
import { Tabs } from '@mantine/core';
import 'ace-builds/src-noconflict/mode-sh';

interface CodeOutputProps {
  output?: string;
  error?: string;
}

export function CodeOutput({ output, error }: CodeOutputProps) {
  return (
    <Tabs defaultValue={output ? 'output' : 'error'}>
      <Tabs.List>
        <Tabs.Tab value="output">Output</Tabs.Tab>
        <Tabs.Tab value="error">Error</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="output">
        <AceEditor
          data-test-id="output"
          style={{ width: '100%' }}
          mode="sh"
          theme="monokai"
          height="300px"
          fontSize={14}
          showPrintMargin
          showGutter
          readOnly
          value={output ? String(output) : 'No output returned, check logs in case of errors!'}
          /*
           *   minLines={minLines}
           *   maxLines={maxLines}
           */
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
      </Tabs.Panel>
      <Tabs.Panel value="error">
        <AceEditor
          data-test-id="console"
          style={{ width: '100%' }}
          mode="sh"
          theme="monokai"
          height="300px"
          fontSize={14}
          showPrintMargin
          showGutter
          readOnly
          value={error ? String(error) : ''}
          /*
           *   minLines={minLines}
           *   maxLines={maxLines}
           */
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
      </Tabs.Panel>
    </Tabs>
  );
}
