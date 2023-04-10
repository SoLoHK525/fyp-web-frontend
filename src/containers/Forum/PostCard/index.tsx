import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import Card from '../../../components/Card';
import ReactAvatar from 'react-avatar';
import Link from 'next/link';
import routes from '../../../utils/routes';
import moment from 'moment/moment';
import { Post } from '../../../api/forum';

export interface PostCardProps {
  post: Post;
}

export default function PostCard(
  {
    post,
  }: PostCardProps) {
  return (
    <Box mt={4} mb={4}>
      <Box mt={4}>
        <Card>
          <Box p={4}>
            <Stack direction='row' spacing={2} mt={2} alignItems='center'>
              <ReactAvatar name={post.author.username} round size='50' />
              <Box color='black'>
                <Link color='primary' href={routes.userProfile(post.author.username)}>
                  <Typography variant='subtitle2'>{post.author?.username}</Typography>
                </Link>
                <Typography
                  variant='caption'>{moment(post.created_at).fromNow()}</Typography>
              </Box>
            </Stack>
            <Box my={4}>
              <Typography variant='h4-bold'> {post.title}</Typography>
            </Box>
            <Divider />
            <div className='ck-content'
                 dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}