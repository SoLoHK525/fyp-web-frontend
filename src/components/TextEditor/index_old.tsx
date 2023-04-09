import { MegadraftEditor, editorStateFromRaw, MegadraftIcons as icons, createTypeStrategy, DraftJS } from 'megadraft';
import { useState } from 'react';
import { Code } from '@mui/icons-material';

import CodeBlockComponent from './CodeBlockComponent';
import Input from "./Input";

const entityInputs = {
  CODE: Input
}

const actions = [
  { type: 'inline', label: 'B', style: 'BOLD', icon: icons.BoldIcon },
  { type: 'inline', label: 'I', style: 'ITALIC', icon: icons.ItalicIcon },
  // these actions correspond with the entityInputs above
  { type: 'entity', label: 'Link', style: 'link', entity: 'LINK', icon: icons.LinkIcon },

  { type: 'separator' },
  { type: 'block', label: 'UL', style: 'unordered-list-item', icon: icons.ULIcon },
  { type: 'block', label: 'OL', style: 'ordered-list-item', icon: icons.OLIcon },
  { type: 'block', label: 'H2', style: 'header-two', icon: icons.H2Icon },
  { type: 'block', label: 'QT', style: 'blockquote', icon: icons.BlockQuoteIcon },
  { type: 'entity', label: 'Code', entity: 'CODE', style: 'code', icon: Code },
];

const myDecorator = new DraftJS.CompositeDecorator([
  {
    strategy: createTypeStrategy('CODE'),
    component: CodeBlockComponent,
  },
]);

export default function TextEditor() {

  const [editorState, setEditorState] = useState(editorStateFromRaw(null, myDecorator));

  const onChange = (editorState: any) => {
    setEditorState(editorState);
  };

  return (
    <MegadraftEditor
      editorState={editorState}
      actions={actions}
      onChange={onChange}
      entityInputs={entityInputs}
      placeholder='Add some text' />
  );
}