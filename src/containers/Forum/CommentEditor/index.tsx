import dynamic from 'next/dynamic';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { Comment, Post, publishForumPostComment, publishForumPostReply } from '../../../api/forum';
import { useState } from 'react';
import { Editor } from '@ckeditor/ckeditor5-core';
import tuple from '../../../utils/tuple';
import { useMutation, useQueryClient } from 'react-query';

const TextEditor = dynamic(() => import('../../../components/TextEditor'), {
  ssr: false,
  loading: () => <Box justifyContent='center'><CircularProgress /></Box>,
});

interface BaseCommentEditorProps {
  target: 'post' | 'comment';
  thread: string;
  post: Post;
  onEditorCancelled?: () => void;
}

export interface PostCommentEditorProps extends BaseCommentEditorProps {
  target: 'post';
  comment?: undefined;
}

export interface ReplyCommentEditorProps extends BaseCommentEditorProps {
  target: 'comment';
  comment: Comment;
}

const CommentEditor = (
  {
    target,
    thread,
    post,
    comment,
    onEditorCancelled,
  }: (ReplyCommentEditorProps | PostCommentEditorProps),
) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const {
    mutate: publishForumCommentMutation,
    isLoading: isCommentLoading,
  } = useMutation(tuple(['publishForumComment', {
    thread,
    postId: post.identifier,
  }]), () => publishForumPostComment(post.id, content), {
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries(tuple(['getForumPostComments', {
        thread,
        postId: post.identifier,
      }]));
    },
  });

  const { mutate: publishForumReplyMutation, isLoading: isReplyLoading } = useMutation(tuple(['publishForumReply', {
    thread,
    postId: post.identifier,
    replyTo: comment?.id,
  }]), () => publishForumPostReply(post.id, content, comment?.id ?? ""), {
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries(tuple(['getForumPostComments', {
        thread,
        postId: post.identifier,
      }]));
      onEditorCancelled && onEditorCancelled();
    },
  });

  const handlePublish = () => {
    if (target === 'post') {
      publishForumCommentMutation();
      return;
    } else {
      publishForumReplyMutation();
      return;
    }
  };

  return (
    <Box>
      <TextEditor
        config={{
          removePlugins: [
            'Heading',
            'FontFamily',
            'FontSize',
            'FontBackgroundColor',
            'MediaEmbed',
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'MediaEmbed',
            'MediaEmbedToolbar',
          ],
          readOnly: isCommentLoading || isReplyLoading,
          placeholder: 'Write a comment...',
        }}
        data={content}
        onChange={(event, editor: Editor) => {
          // @ts-ignore
          setContent(editor.getData());
        }}
      />
      <Stack direction="row" spacing={2} mt={2} justifyContent='end'>
        {
          onEditorCancelled && (
            <Button style={{ fontSize: 12 }} size="small" disabled={isCommentLoading || isReplyLoading} variant='outlined' onClick={onEditorCancelled}
                    color='inherit'>Cancel</Button>
          )
        }
        <Button style={{ fontSize: 12 }} size="small" disabled={isCommentLoading || isReplyLoading} variant='outlined' onClick={handlePublish}
                color='inherit'>Submit</Button>
      </Stack>
    </Box>
  );
};

export default CommentEditor;