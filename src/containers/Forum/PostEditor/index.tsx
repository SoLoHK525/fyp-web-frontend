import { useEffect, useState } from 'react';

import { Editor } from '@ckeditor/ckeditor5-core';
import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useMutation, useQueryClient } from 'react-query';

import { Post, publishForumPost, updateForumPost } from '../../../api/forum';
import Spacer from '../../../components/Spacer';
import tuple from '../../../utils/tuple';

const TextEditor = dynamic(() => import('../../../components/TextEditor'), {
  ssr: false,
  loading: () => <Box justifyContent='center'><CircularProgress /></Box>,
});

export interface PostEditorProps {
  thread: string;
  post: Post;
}

export default function PostEditor(
  {
    thread: threadString,
    post,
  }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  const queryClient = useQueryClient();


  const { mutate: publishForumPostMutate, isLoading: isPublishing } = useMutation(tuple(['publishForumPost', {
    thread: threadString,
    postId: post.identifier,
  }]), () => publishForumPost(threadString, post.identifier), {
    onSuccess: () => {
      queryClient.invalidateQueries(tuple(['getForumPost', {
        thread: threadString,
        postId: post.identifier,
      }]));
    },
  });

  const { mutate: updateForumPostMutate, isLoading: isUpdatingForumPost } = useMutation(tuple(['updateForumPost', {
    thread: threadString,
    postId: post.identifier,
  }]), () => updateForumPost(threadString, post.identifier, {
    title,
    content,
  }), {
    onSuccess: () => {
      setSaved(true);
    },
  });

  // prevent user from leaving page if they have unsaved changes
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!saved) {
      event.preventDefault();

      // prompt user to confirm they want to leave
      const ans = window.confirm('You have unsaved changes. Are you sure you want to leave?');

      console.log(ans);
      if (ans) {
        history.pushState(null, document.title, location.href);
        event.stopPropagation();
      } else {
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        event.stopPropagation();
      }

      return event.returnValue;
    }
  };

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content || '');
  }, [post]);

  // add event listener
  useEffect(() => {
    if (window === undefined) {
      return;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);
    window.addEventListener('popstate', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
      window.removeEventListener('popstate', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onContentChange = (event: React.ChangeEvent<HTMLInputElement>, value: Editor) => {
    // @ts-ignore
    setContent(value.getData());
    setSaved(false);
  };

  const onAutoSave = (editor: Editor) => {
    console.log('Autosaving...');

    // @ts-ignore
    setContent(editor.getData());
    updateForumPostMutate();
    setSaved(true);
  };

  const publish = () => {
    publishForumPostMutate();
  };

  return (
    <Container>
      <Box mt={4} mb={4}>
        <TextField
          value={title}
          onChange={onTitleChange}
          label='Title'
          placeholder='Enter title here...'
          variant='standard'
          fullWidth
        />
      </Box>
      <TextEditor
        data={content}
        onChange={onContentChange}
        onAutoSave={onAutoSave}
      />
      <Box display='flex' mt={4} alignItems='center'>
        <Box>
          {!saved && <Box component='span' mr={1}><CircularProgress size={10} /></Box>}
          <Typography variant='caption'
                      color={saved ? 'green' : 'text.disabled'}>{saved ? 'Synchronized' : 'Synchronizing...'}</Typography>
        </Box>
        <Spacer />
        <Box>
          <Button variant='outlined' color='inherit' onClick={publish}>{isPublishing ?
            <CircularProgress size={10} /> : 'Publish'}</Button>
        </Box>
      </Box>
    </Container>
  );
}