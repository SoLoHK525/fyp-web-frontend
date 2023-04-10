import { Post } from '../../../api/forum';
import Card from '../../../components/Card';
import { Box, Typography } from '@mui/material';
import { PostListCardProps } from '../PostList';
import ReactAvatar from 'react-avatar';
import Link from 'next/link';
import routes from '../../../utils/routes';

export default function SmallPostCard({ post, thread }: PostListCardProps) {
  return (
    <Link href={routes.post(thread, post.identifier)}>
      <Card style={{ borderRadius: 4 }}>
        <Box p={2}>
          <Box display='flex'>
            <ReactAvatar name={post.title} size='16' round />
            <Typography fontSize={12} ml={1} color='grey'>{post.author.username}</Typography>
          </Box>
          <Box mt={2}>
            <Typography fontSize={16} fontWeight='bold'>{post.title}</Typography>
          </Box>
        </Box>
      </Card>
    </Link>
  );
}