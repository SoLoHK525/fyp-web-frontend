import { FC } from 'react';
import { Post } from '../../../api/forum';
import Link from '../../../components/Link';
import routes from '../../../utils/routes';
import { Badge, Box, Stack, Typography } from '@mui/material';
import ReactAvatar from 'react-avatar';
import moment from 'moment/moment';
import { PostListCardProps } from '../PostList';

const LargePostCard: FC<PostListCardProps> = (
  {
    thread,
    post,
  }) => {
  return (
    <Link href={routes.post(thread, post.identifier)}>
      <Box display='flex' alignItems='center' py={1}>
        <Box mr={4}>
          <Badge badgeContent={post.comments.length} color='primary'>
            <ReactAvatar name={post.title} size='50' textSizeRatio={1.75} round />
          </Badge>
        </Box>
        <Box>
          <Stack direction='row' spacing={1}>
            <Typography color='grey' variant='caption'>Posted by <Link
              href={routes.userProfile(post.author.username)}>{post.author.username} {moment(post.created_at).fromNow()}</Link>
            </Typography>
          </Stack>
          <Typography variant='h6' mt={2} fontWeight='bold'>{post.title ?? '[No title]'}</Typography>
          <Box mt={2}>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default LargePostCard;