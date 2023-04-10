import CustomAppBar from '../../../containers/AppBar';
import { Box, Button, Container, Divider, Stack, Typography } from '@mui/material';
import Spacer from '../../../components/Spacer';
import Footer from '../../../components/Footer';
import PostList from '../../../containers/Forum/PostList';
import { useRouter } from 'next/router';
import LargePostCard from '../../../containers/Forum/LargePostCard';

export default function ForumThread() {
  const router = useRouter();
  const { thread } = router.query;

  if (!thread || typeof thread != 'string') {
    return <>Thread not found</>;
  }

  return (
    <>
      <CustomAppBar />
      <Box minHeight='50vh' mb={4}>
        <Container>
          <Box display='flex' alignItems='center'>
            <Box>
              <h1>Forum</h1>
              <h3>Thread: {thread}</h3>
            </Box>
            <Spacer />
            <Stack direction='row' spacing={2} color='black'>
              <Button variant='text' color='inherit'>Drafts</Button>
              <Button variant='outlined' color='inherit'>New Post</Button>
            </Stack>
          </Box>
          <Divider />
          <Box mt={4}>
            <Typography variant='subtitle2'>Posts</Typography>
          </Box>
          <PostList
            Card={({ post, thread }) => <LargePostCard post={post} thread={thread} />}
            thread={thread}
          />
        </Container>
      </Box>
      <Footer />
    </>
  );
}