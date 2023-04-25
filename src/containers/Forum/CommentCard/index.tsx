import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import ReactAvatar from 'react-avatar';
import Link from 'next/link';
import routes from '../../../utils/routes';
import moment from 'moment/moment';
import { Comment, CommentWithChildren, Post } from '../../../api/forum';
import { Reply } from '@mui/icons-material';
import CommentEditor from '../CommentEditor';
import { useState } from 'react';
import { useAuthentication } from '../../../contexts/AuthenticationContext';

export interface CommentCardProps {
  comment: CommentWithChildren;
  threadId: string;
  post: Post;
}

export default function CommentCard(
  {
    threadId,
    post,
    comment,
  }: CommentCardProps) {
  const auth = useAuthentication();
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const toggleReplyEditor = () => {
    setShowReplyEditor(v => !v);
  };

  return (
    <Box px={2} my={1} position='relative'>
      <Stack direction='row' spacing={2} alignItems='center'>
        <ReactAvatar name={comment.author.username} round size='40' style={{ zIndex: 2 }} />
        <Box color='#333'>
          <Link style={{
            textDecoration: 'none',
            color: 'inherit',
            '&:visited': {
              color: 'inherit',
            },
          }} color='primary' href={routes.userProfile(comment.author.username)}>
            <Typography variant='subtitle1'>{comment.author.username}</Typography>
          </Link>
          <Typography variant='caption'>{moment(comment.created_at).fromNow()}</Typography>
        </Box>
      </Stack>
      <Box pl={7} pb={1}>
        <div className='ck-content'
             dangerouslySetInnerHTML={{ __html: comment.content ?? '' }} />
      </Box>
      {
        auth.isAuthenticated && (
          <Box pl={7}>
            <Button onClick={toggleReplyEditor} sx={{ fontSize: 12 }} color='inherit' variant={'text'}
                    size='small'><Reply fontSize='inherit' />&nbsp; Reply</Button>
            {
              showReplyEditor && (
                <CommentEditor onEditorCancelled={() => {
                  setShowReplyEditor(false);
                }} target='comment' comment={comment} thread={threadId} post={post} />
              )
            }
          </Box>
        )
      }

      <Box pl={7}>
        {
          comment.children?.map((child) => (
            <CommentCard key={child.id} comment={child} threadId={threadId} post={post} />
          ))
        }
      </Box>
      <Box bgcolor='disabled.main' height='calc(100% - 40px)' left={25} ml='10px' bottom={0} position='absolute'
           width='1px'>
      </Box>
    </Box>
  );
}