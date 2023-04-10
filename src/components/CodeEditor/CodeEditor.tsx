import React, { FC, useEffect, useRef } from 'react';
import {
  CloseAction,
  ErrorAction,
  MessageTransports,
  MonacoLanguageClient,
  MonacoServices,
  State,
} from 'monaco-languageclient';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// @ts-ignore
import { CommandsRegistry } from 'monaco-editor/esm/vs/platform/commands/common/commands';
import { loader, OnChange } from '@monaco-editor/react';
import normalizeUrl from 'normalize-url';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';

// @ts-ignore
import { language, conf } from 'monaco-editor/esm/vs/basic-languages/python/python';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { parse as parseUrl } from 'url';
import { typeOf } from 'react-is';

loader.config({
  monaco: monaco,
});

export interface CodeEditorProps {
  onChange: OnChange;
  endpoint: string;
}

function setupKeybindings(editor: any) {
  const formatCommandId = 'editor.action.formatDocument';
  const { handler, when } = CommandsRegistry.getCommand(formatCommandId);
  editor._standaloneKeybindingService.addDynamicKeybinding(
    formatCommandId,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    handler,
    when,
  );
}

monaco.languages.register({
  id: 'python',
  extensions: ['.python', '.py', '.pyd'],
  aliases: ['Python', 'python'],
  mimetypes: ['application/json'],
});

monaco.languages.setMonarchTokensProvider('python', language);
monaco.languages.setLanguageConfiguration('python', conf);

const value =
  `"""
Python Code Example
"""
  
print("Hello World")
`;


function createWebSocket(url: string) {
  const webSocket = new WebSocket(url);
  webSocket.onopen = () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = createLanguageClient({
      reader,
      writer,
    });
    languageClient.start();
    reader.onClose(() => {
        if (languageClient.state === State.Running) {
          languageClient.stop();
        }
      },
    );
  };
  return webSocket;
}

function createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['python'],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.Restart }),
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
}

const Editor: FC<CodeEditorProps> = ({ language, defaultValue, value, onChange, endpoint }: any) => {
  const divEl = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  console.log(MonacoLanguageClient);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let lspWebSocket: WebSocket;

  const url = parseUrl(endpoint);

  useEffect(() => {
    const model = monaco.editor.createModel(value, 'python', monaco.Uri.parse('inmemory:///model.json'));

    let style: HTMLStyleElement;

    const isSecure = url.protocol === 'https:';
    const webSocketEndpointUrl = (isSecure ? 'wss' : 'ws') + '://' + url.hostname + ':' + (url.port || isSecure ? 443 : 80);

    console.log(webSocketEndpointUrl);

    if (divEl.current) {
      // append new css to head
      style = document.createElement('style');

      document.head.appendChild(style);

      // @ts-ignore
      editor.current = monaco.editor.create(divEl.current, {
        value: value,
        model: model,
        minimap: { enabled: true },
        theme: 'vs-dark',
      });

      MonacoServices.install();

      const lspWebSocketUrl = normalizeUrl(webSocketEndpointUrl + '/test');
      lspWebSocket = createWebSocket(lspWebSocketUrl);

      editor.current.onDidChangeModelContent(() => {
        onChange(editor.current?.getValue());
      });
    }

    setupKeybindings(editor.current);

    if (editor.current != null) {
      const editorModel = editor.current.getModel();
      if (!editorModel) {
        return;
      }

      // YJS bindings
      const ydoc = new Doc();

      const websocketUrl = webSocketEndpointUrl + '/yjs';

      const provider = new WebsocketProvider(websocketUrl, 'project', ydoc, {
        params: {},
      });

      provider.ws?.addEventListener('close', () => {
        provider.ws?.close();
        provider.disconnect();
      });

      // const provider = new WebsocketProvider('wss://demos.yjs.dev', 'monaco', ydoc);
      const type = ydoc.getText('monaco');

      provider.awareness.on('change', () => {
        console.log('wtf');

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
          console.debug(key);

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
      });

      provider.awareness.setLocalStateField('user', {
        name: 'test' + Math.random(),
        color: Math.floor(Math.random() * 16777215).toString(16),
      });

      const monacoBinding = new MonacoBinding(type, editorModel, new Set([editor.current]), provider.awareness);

      divEl.current;

      // @ts-ignore
      window.example = { provider, ydoc, type, monacoBinding };

      // End YJS bindings
    }

    window.onbeforeunload = () => {
      // On page reload/exit, close web socket connection
      lspWebSocket?.close();
    };

    return () => {
      monaco.editor.getModel(monaco.Uri.parse('inmemory:///model.json'))?.dispose();
      lspWebSocket?.close();
      editor.current?.dispose();
    };
  }, [onChange, value]);

  useEffect(() => {
    const model = editor.current?.getModel();

    // @ts-ignore
    monaco.editor.setModelLanguage(model, 'python');
  }, [language]);

  useEffect(() => {
    if (defaultValue) {
      editor.current?.setValue(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (value) {
      editor.current?.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.setTimeout(() => editor.current?.layout(), 0);
    });

    // @ts-ignore
    observer.observe(divEl.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div style={{ width: '100%', height: '100%' }} ref={divEl}></div>;
};

export default Editor;
