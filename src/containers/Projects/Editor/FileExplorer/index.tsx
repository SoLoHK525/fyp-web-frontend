import {
  StaticTreeDataProvider,
  Tree,
  TreeEnvironmentRef,
  TreeItem, TreeRef,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  useTheme,
} from '@mui/material';
import { ContentCopy, Delete, DriveFileRenameOutline, Folder, Home } from '@mui/icons-material';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { request } from '../../../../api/_base';
import tuple from '../../../../utils/tuple';
import { useRef, useState } from 'react';
import ContextMenu from './ContextMenu';
import { getProjectFilesResponse } from '../../../../api/project';


export default function FileExplorer(
  {
    onFileSelect,
  }: {
    onFileSelect?: (id: string) => void,
  }
) {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const environment = useRef<TreeEnvironmentRef>();
  const tree = useRef<TreeRef>();
  const box = useRef<HTMLDivElement>();

  const { data } = useQuery('getProjectFiles', () => {
    return request<getProjectFilesResponse>(
      'get',
      '/api/file',
      {},
      true,
      {},
      'https://fyp-exector.iamkevin.xyz',
    );
  });

  const [id, setId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [isFolder, setIsFolder] = useState<boolean>(true);

  /**
   * context menu
   */
  const [contextMenuItem, setContextMenuItem] = useState<TreeItem>({} as TreeItem);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<null | HTMLElement>(null);


  const handleContextMenuClose = () => {
    setContextMenuAnchor(null);
  };

  const { mutate: renameMutation } = useMutation(isFolder ? 'renameFolder' : 'renameFile', () => {
      return request(
        'post',
        `/api/file/rename/${isFolder ? 'directory' : 'file'}`,
        {
          id: id,
          name: newName,
        },
        true,
        {},
        'https://fyp-exector.iamkevin.xyz',
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getProjectFiles');
      },
    },
  );

  if (!data) {
    return <></>;
  }

  const items = [...data.payload.directories.map((directory) => {
    return {
      index: directory.id,
      children: [...directory.files, ...directory.directories],
      data: directory.name,
      canRename: true,
      canMove: true,
      isFolder: true,
    };
  }), ...data.payload.files.map((file) => {
    return {
      index: file.id,
      children: [],
      data: file.name,
      canRename: true,
      canMove: true,
      isFolder: false,
    };
  })].reduce((a, v) => ({ ...a, [v.index]: v }), {});

  const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

  return (
    <Box sx={{
      flexGrow: 1,
      p: 1,
      height: '100%',
      color: '#ccc',
      backgroundColor: '#252526',
    }}>
      <style>{`
        :root {
          --rct-color-tree-bg: inherit;
          --rct-color-tree-focus-outline: transparent;
        
          --rct-color-focustree-item-selected-bg: #353535;
          --rct-color-focustree-item-selected-text: #fff;
          --rct-bar-color: #ccc;
          --rct-color-focustree-item-focused-border: #eee;
          --rct-color-focustree-item-hover-bg: #353535;
          --rct-color-focustree-item-hover-text: #fff;
          --rct-color-focustree-item-active-bg: #888;
          --rct-color-focustree-item-active-text: #fff;
          --rct-color-focustree-item-draggingover-bg: #727272;
          --rct-color-focustree-item-draggingover-color: #fff;
        
          --rct-color-nonfocustree-item-selected-bg: #585858;
          --rct-color-nonfocustree-item-selected-text: inherit;
          --rct-color-nonfocustree-item-focused-border: transparent;
        
          --rct-color-search-highlight-bg: #a2aed2;
          --rct-color-drag-between-line-bg: #0366d6;
          --rct-color-arrow: #ccc;
        
          --rct-item-height: 22px;
        
          --rct-color-renaming-input-submitbutton-bg: inherit;
          --rct-color-renaming-input-submitbutton-bg-hover: #222222;
          --rct-color-renaming-input-submitbutton-bg-active: #555555;
        
          --rct-color-renaming-input-submitbutton-text: inherit;
          --rct-color-renaming-input-submitbutton-text-hover: #ffffff;
          --rct-color-renaming-input-submitbutton-text-active: #ffffff;
        }
      `}</style>
      <UncontrolledTreeEnvironment
        ref={environment}
        dataProvider={dataProvider}
        getItemTitle={item => item.data}
        viewState={{}}
        canDragAndDrop={true}
        canDropOnFolder={true}
        canReorderItems={false}
        canRename={true}
        onPrimaryAction={(item) => {
          if (item.isFolder) {
            return;
          }

          onFileSelect(item.index as string);
        }}
        onDrop={(item, parent, index) => {
          console.log(item, parent, index);
        }}
        onRenameItem={(item, newName) => {
          console.log(item, newName);
          setId(item.index as string);
          setNewName(newName);
          setIsFolder(!!item.isFolder);

          // execute on next tick
          setTimeout(() => {
            renameMutation();
          }, 0);
        }}

        renderItemTitle={({ title, item }) => {
          const extension = item.data.split('.').pop();

          return (
            <Box
              ref={box}
              onContextMenu={(e) => {
                e.preventDefault();
                // append context menu at cursor position
                setContextMenuAnchor(e.currentTarget);
                setContextMenuItem(item);

                console.log('right click');
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              {
                item.isFolder ? <Folder fontSize='inherit' /> :
                  <Box display='flex' alignItems='center' style={{ width: '12px' }}>
                    {/* @ts-ignore */}
                    <FileIcon extension={extension} {...defaultStyles[extension]} />
                  </Box>
              }
              &nbsp; {title}
            </Box>
          );
        }}
      >
        <Tree ref={tree} treeId='tree-2' rootItem='00000000-0000-0000-0000-000000000000' treeLabel='Tree Example' />
      </UncontrolledTreeEnvironment>
      <ContextMenu
        actions={[
          {
            name: 'Rename',
            icon: <DriveFileRenameOutline />,
            shortcut: 'F2',
            onClick: () => {
              handleContextMenuClose();

              setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2' }));
                document.dispatchEvent(new KeyboardEvent('keyup', { key: 'F2' }));
              }, 0);
            },
          },
          {
            name: 'Delete',
            icon: <Delete />,
            onClick: () => {
              console.log('delete');
              handleContextMenuClose();
            },
          },
        ]}
        contextMenuAnchor={contextMenuAnchor}
        handleContextMenuClose={handleContextMenuClose}
      />
    </Box>
  );
}