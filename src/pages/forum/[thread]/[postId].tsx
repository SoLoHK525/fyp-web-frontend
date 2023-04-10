/**
 * lazy load alloy editor
 */

import { Box, Button, CircularProgress, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import {
  Comment, CommentWithChildren,
  getForumPost,
  getForumPostComments,
} from '../../../api/forum';
import Footer from '../../../components/Footer';
import Spacer from '../../../components/Spacer';
import CustomAppBar from '../../../containers/AppBar';
import CommentEditor from '../../../containers/Forum/CommentEditor';
import PostCard from '../../../containers/Forum/PostCard';
import PostEditor from '../../../containers/Forum/PostEditor';
import PostList from '../../../containers/Forum/PostList';
import SmallPostCard from '../../../containers/Forum/SmallPostCard';
import tuple from '../../../utils/tuple';
import CommentCard from '../../../containers/Forum/CommentCard';
import { useMemo } from 'react';

export default function NewForumPost() {
  const router = useRouter();
  const { thread, postId } = router.query;

  const threadString = thread as string;
  const postIdString = postId as string;

  const { data: getForumPostData } = useQuery(tuple(['getForumPost', {
    thread: threadString,
    postId: postIdString,
  }]), () => getForumPost(threadString, postIdString), {
    refetchOnMount: true,
    retryOnMount: true,
    enabled: !!threadString && !!postIdString,
  });

  const { data: getForumPostCommentsData } = useQuery(tuple(['getForumPostComments', {
    thread: threadString,
    postId: postIdString,
  }]), () => getForumPostComments(threadString, postIdString), {
    enabled: !!threadString && !!postIdString && !!getForumPostData,
  });

  /*
    Build a comment tree from the flat list of comments
   */
  const comments = useMemo(() => {
    const commentTree: Comment[] = [];
    const commentMap = new Map<string, CommentWithChildren>();

    getForumPostCommentsData?.payload.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    getForumPostCommentsData?.payload.forEach((comment) => {
      if (comment.replyTo) {
        const parent = commentMap.get(comment.replyTo.id);

        if (parent) {
          parent.children = [...(parent.children || []), comment];
        }
      } else {
        commentTree.push(comment);
      }
    });

    return commentTree;
  }, [getForumPostCommentsData]);

  return (
    <>
      <CustomAppBar />
      <Box mb={4} minHeight='50vh'>
        <Container>
          <Box alignItems='center' display='flex'>
            <Box>
              <h1>Forum</h1>
              <h3>Thread: {thread}</h3>
            </Box>
            <Spacer />
            <Stack color='black' direction='row' spacing={2}>
              <Button color='inherit' variant='text'>Drafts</Button>
              <Button color='inherit' variant='outlined'>New Post</Button>
            </Stack>
          </Box>
          <Divider />
          <Box mt={4}>
            <Typography variant='subtitle2'>Posts</Typography>
          </Box>
          {
            !getForumPostData ? (
              <Box mt={4}>
                <CircularProgress />
              </Box>
            ) : (
              getForumPostData?.payload.status === 'draft' ? (
                  <PostEditor post={getForumPostData.payload} thread={threadString} />
                ) :
                <Grid container sx={{
                  alignItems: 'start',
                }}>
                  <Grid item lg={8}>
                    <PostCard post={getForumPostData.payload} />

                    <Box>
                      <Typography variant='caption'>Comment:</Typography>
                      <Box mt={1}>
                        <CommentEditor
                          post={getForumPostData.payload}
                          target='post'
                          thread={threadString}
                        />
                      </Box>
                    </Box>
                    <Box my={4}>
                      <Divider />
                    </Box>
                    <Box>
                      <Typography variant='caption'>Comments:</Typography>
                      <Stack>
                        {
                          comments.length === 0 && (
                            <Box mt={1}>
                              <Typography color='disabled.main' variant='caption'>No comments yet</Typography>
                            </Box>
                          )
                        }
                        {
                          comments.map(comment => (
                            <Box key={comment.id}>
                              <CommentCard comment={comment} threadId={threadString} post={getForumPostData.payload} />
                            </Box>
                          ))
                        }
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item lg={4} sx={{ position: 'sticky', top: '0px' }}>
                    <Box px={4} py={4}>
                      <Typography variant='subtitle2'>Recent Posts</Typography>
                      <Box mt={4}>
                        <PostList
                          Card={({ post, thread }) => <SmallPostCard post={post} thread={thread} />}
                          exclude={[getForumPostData.payload.id]}
                          pagination={false}
                          thread={threadString}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
            )
          }
        </Container>
      </Box>
      <Footer />
    </>
  );
}