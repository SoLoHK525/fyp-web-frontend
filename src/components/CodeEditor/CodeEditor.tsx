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
import createYjsWebSocketMonacoBinding from './YjsMonacoBinding';

loader.config({
  monaco: monaco,
});

export interface CodeEditorProps {
  onChange: OnChange;
  endpoint: string;
  file: string;
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
          // languageClient.stop();
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

const Editor: FC<CodeEditorProps> = ({ language, defaultValue, value, onChange, endpoint, file }: any) => {
  const divEl = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let lspWebSocket: WebSocket;

  const url = parseUrl(endpoint);

  useEffect(() => {
    const modelURI = monaco.Uri.parse('inmemory:///model.py');
    const model = monaco.editor.createModel(value, 'python', modelURI);

    const isSecure = url.protocol === 'https:';
    const webSocketEndpointUrl = (isSecure ? 'wss' : 'ws') + '://' + url.hostname + ':' + (url.port || isSecure ? 443 : 80);

    if (divEl.current) {
      // @ts-ignore
      editor.current = monaco.editor.create(divEl.current, {
        value: value,
        model: model,
        minimap: { enabled: true },
        theme: 'vs-dark',
        readOnly: true,
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
      const websocketUrl = webSocketEndpointUrl + '/yjs';

      const yjsWebsocket = createYjsWebSocketMonacoBinding({
        editor: editor.current,
        endpoint: websocketUrl,
        file,
      });


      yjsWebsocket.then((yjsWebsocket) => {
        window.onbeforeunload = () => {
          yjsWebsocket.cleanup();
          // On page reload/exit, close web socket connection
          if (lspWebSocket.readyState === WebSocket.OPEN) {
            console.log(lspWebSocket.readyState);
            lspWebSocket?.close();
          }
          monaco.editor.getModel(modelURI)?.dispose();
        };

        return yjsWebsocket;
      });

      return () => {
        if (lspWebSocket.readyState === WebSocket.CONNECTING) {
          lspWebSocket?.close();
        }

        yjsWebsocket.then((yjsWebsocket) => {
          yjsWebsocket.cleanup();
          console.log("clean up mother fucker", yjsWebsocket)
        });

        monaco.editor.getModel(modelURI)?.dispose();
        editor.current?.dispose();
      };
    }

    return () => {
      monaco.editor.getModel(modelURI)?.dispose();
      editor.current?.dispose();
    };
  }, [onChange, value, file]);

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
