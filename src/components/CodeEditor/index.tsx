// import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { CSSProperties, useEffect, useRef } from 'react';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

// loader.config({ monaco });

export interface CodeEditorProps {
  height?: CSSProperties['height'];
}

const value = `
# Example Python Code
import numpy as np

def hello_world():
  print('Hello World!')

hello_world()
`;

export default function CodeEditor(
  {
    height = '100%',
  }: CodeEditorProps,
) {
  const editorRef = useRef<IStandaloneCodeEditor>(null);

  function handleEditorDidMount(editor: IStandaloneCodeEditor,
                                monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // @ts-ignore
    editorRef.current = editor;

    editor.addAction({
      id: 'test',
      label: 'Test',
      keybindings: [
        monaco?.KeyMod.CtrlCmd | monaco?.KeyCode.KeyD,
      ],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (ed) => {
        console.log('test');
        console.log(ed);
      },
    });

  }



  const onChange = (newValue: string | undefined, e:editor.IModelContentChangedEvent) => {
    console.log('onChange', newValue, e);
    console.log(e.versionId);
  };

  return (
    <Editor
      onChange={onChange}
      height={height}
      defaultLanguage='python'
      defaultValue={value}
      theme='vs-dark'
      onMount={handleEditorDidMount}
    />
  );
}