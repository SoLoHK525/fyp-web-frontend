// import * as monaco from 'monaco-editor';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { CSSProperties } from 'react';

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
`

export default function CodeEditor(
  {
    height = '100%',
  }: CodeEditorProps
) {
  const monaco = useMonaco();

  return (
    <Editor
      height={height}
      defaultLanguage='python'
      defaultValue={value}
      theme='vs-dark'
    />
  );
}