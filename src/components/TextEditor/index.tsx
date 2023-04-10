import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../../packages/ckeditor/build/ckeditor';
import { PropsWithChildren } from 'react';
import { Editor } from '@ckeditor/ckeditor5-core';

export interface TextEditorProps extends PropsWithChildren {
  data?: string;
  onChange?: (event: any, editor: Editor) => any;
  onReady?: (editor: Editor) => any;
  onBlur?: (event: any, editor: Editor) => any;
  onFocus?: (event: any, editor: Editor) => any;
  onAutoSave?: (editor: Editor) => any;
  config?: any;
}

export default function TextEditor(
  {
    data = '',
    onChange,
    onReady,
    onFocus,
    onBlur,
    onAutoSave,
    config
  }: TextEditorProps) {
  return (
    <CKEditor
      config={{
        ...config,
        // @ts-ignore
        autosave: {
          save: onAutoSave,
          waitingTime: 5000, // in ms
        }
      }}
      data={data}
      editor={ClassicEditor}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      onReady={onReady}
    />
  );
}