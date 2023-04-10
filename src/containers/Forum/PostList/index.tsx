import { FC, useState } from 'react';
import { getForumThreadPosts, getForumThreads, Post, Thread } from '../../../api/forum';
import { useQuery } from 'react-query';
import { Badge, Box, Card, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import Link from '../../../components/Link';
import routes from '../../../utils/routes';
import ReactAvatar from 'react-avatar';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';

export interface PostListCardProps {
  post: Post;
  thread: string;
}

const
  PostList: FC<{
    thread: string,
    Card: (props: PostListCardProps) => JSX.Element;
    exclude?: string[];
    pagination?: boolean;
  }> = (
    {
      thread,
      Card,
      exclude,
      pagination = true,
    }) => {
    const [page, setPage] = useState(1);

    const { data: posts } = useQuery('getForumThreadPosts', () => getForumThreadPosts(thread), {
      onSuccess: (data) => {
        setPage(data.payload.meta.currentPage);
      },
    });

    if (!posts) {
      return (<div>Loading...</div>);
    }

    const postsToRender = posts.payload.data.filter((post) => !exclude?.includes(post.id));

    return (
      <div>
        {
          postsToRender.length === 0 && (
            <Box display='flex' justifyContent='center' mt={4}>
              <Typography variant='h6'>No posts yet</Typography>
            </Box>
          )
        }
        <Stack mt={4} spacing={1} divider={<Divider />}>
          {postsToRender.map((post) => (
            <Card key={post.id} thread={thread} post={post} />
          ))}
        </Stack>

        {
          pagination && (
            <Box mt={4} display='flex' justifyContent='center'>
              <Pagination
                count={posts.payload.meta.totalPages}
                onChange={(event, page) => {
                  setPage(page);
                }}
                page={page}
              />
            </Box>
          )
        }
      </div>
    );
  };

export default PostList;