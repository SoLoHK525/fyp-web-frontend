import { Box, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { createForumPost } from '../../../api/forum';
import { useRouter } from 'next/router';
import routes from '../../../utils/routes';
import tuple from '../../../utils/tuple';
import Spacer from '../../../components/Spacer';
import { Cancel } from '@mui/icons-material';

export function NewThreadModal(
  {
    thread,
    showNewPostModal,
    setShowNewPostModal,
  }: {
    thread: string,
    showNewPostModal: boolean,
    setShowNewPostModal: (show: boolean) => void,
  },
) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const { mutate: createForumPostMutation } = useMutation(tuple(['createForumPost', {
    thread,
    title,
  }]), () => createForumPost(thread, {
    title,
  }), {
    onSuccess: (data) => {
      setShowNewPostModal(false);
      router.push(routes.post(thread, data.payload.identifier));
    },
  });

  const submit = () => {
    if (title.length === 0) {
      return;
    }

    createForumPostMutation();
  };

  return (
    <Modal onClose={() => {
      setShowNewPostModal(false);
    }} open={showNewPostModal}>
      <Box flex={1} display='flex' height='100%' justifyContent='center' alignItems='center'>
        <Box width={700}>
          <Paper>
            <Box p={2}>
              <Box display='flex'>
                <Typography variant='subtitle2'>New Post</Typography>
                <Spacer />
                <Button size="small" onClick={() => {
                  setShowNewPostModal(false);
                }}><Cancel /></Button>
              </Box>
              <Box mt={2}>
                <Stack spacing={2} mt={1}>
                  <TextField label='Title' dense fullWidth onChange={onTitleChange} />
                  <Button variant='contained' color='primary' onClick={submit}>Create</Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Modal>
  );
}