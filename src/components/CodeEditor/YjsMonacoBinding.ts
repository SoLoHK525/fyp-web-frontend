import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { File, Folder } from './types';

export interface YjsMonacoWebsocketBindingConfig {
  endpoint: string;
  editor: IStandaloneCodeEditor;
  file: string;
}

const injectCssStyle = () => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style;
};

const updateCssStyle = ({ style, provider }: {
  style: HTMLStyleElement,
  provider: WebsocketProvider
}) => {
  let cssText = `
          .yRemoteSelection {
              background-color: rgb(250, 129, 0, .5);
          }
          .yRemoteSelectionHead {
              position: absolute;
              content: '';
              border-left: orange solid 2px;
              border-top: orange solid 2px;
              border-bottom: orange solid 2px;
              height: 100%;
              box-sizing: border-box;
              z-index: 1000;
          }
        `;


  provider.awareness.getStates().forEach((user, key) => {
    cssText += `
          .yRemoteSelectionHead::after {
              position: absolute;
              content: '';
              border: 3px solid orange;
              border-radius: 4px;
              left: -4px;
              top: -5px;
              z-index: 1000;
          }
          
          .yRemoteSelectionHead-${key}:hover::before {
              position: absolute;
              background: orange;
              content: '${key}';
              border: 3px solid orange;
              border-radius: 4px;
              left: -4px;
              top: -20px;
              z-index: 1000;
          }
          `;
  });

  style.innerHTML = cssText;
};

export default function createYjsWebSocketMonacoBinding(
  {
    endpoint,
    editor,
    file,
  }: YjsMonacoWebsocketBindingConfig): Promise<{
  provider: WebsocketProvider,
  monacoBinding: MonacoBinding,
  cleanup: () => void
}> {
  const docProvider = new Map<string, WebsocketProvider>();
  const style = injectCssStyle();
  const rootDoc = new Doc({
    guid: file
  });

  const provider = new WebsocketProvider(endpoint, 'project', rootDoc, {
    params: {
      guid: file
    },
  });

  provider.ws?.addEventListener('close', () => {
    provider.ws?.close();
    provider.disconnect();
  });

  provider.awareness.on('change', () => {
    updateCssStyle({ style, provider });
  });

  provider.awareness.setLocalStateField('user', {
    name: 'test' + Math.random(),
    color: Math.floor(Math.random() * 16777215).toString(16),
  });

  provider.ws?.addEventListener('close', () => {
    provider.ws?.close();
    provider.disconnect();
  });

  provider.on('sync', (isSynced: any) => {
    editor.updateOptions({
      readOnly: !isSynced,
    });
    //
    //
    // const folder = rootDoc.getMap<Doc>();
    //
    // let fileDoc: Doc;
    // if(folder.has(file)) {
    //   fileDoc = folder.get(file) as Doc;
    //   fileDoc.load();
    // }else{
    //   fileDoc = new Doc();
    //   folder.set(file, fileDoc);
    // }

    // rootDoc.subdocs.forEach((doc) => {
    //
    //
    //
    //   // const webSocketProvider = new WebsocketProvider(endpoint, 'project', doc, {
    //   //   params: {
    //   //     guid: doc.guid,
    //   //   },
    //   //   awareness: provider.awareness,
    //   // });
    //   //
    //   //
    //   // webSocketProvider.ws?.addEventListener('close', () => {
    //   //   webSocketProvider.ws?.close();
    //   //   webSocketProvider.disconnect();
    //   // });
    // });
  });

  const editorModel = editor.getModel();
  const type = rootDoc.getText(file);

  if (!editorModel) {
    throw new Error('editor model is not defined');
  }

  const monacoBinding = new MonacoBinding(type, editorModel, new Set([editor]), provider.awareness);

  return new Promise((resolve, reject) => {
    provider.on('sync', (isSynced: boolean) => {
      resolve({
        provider,
        monacoBinding,
        cleanup() {
          provider.awareness.destroy();
          provider.ws?.close();
          provider.disconnect();
          monacoBinding.destroy();
        },
      });
    });
  });
}