import { PaginationResponse, request } from './_base';
import { User } from './auth';


export interface Thread {
  id: string;
  name: string;
  description: string;
}

export const getForumThreads = () => request<Thread[]>('get', '/forum');

export enum ForumPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  status: ForumPostStatus;
  identifier: string;
  comments: Pick<Comment, 'id'>[];
  created_at: string;
  updated_at: string;
  author: Omit<User, 'email'>;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: User;
  replyTo?: Comment;
}

export interface CommentWithChildren extends Comment {
  children?: CommentWithChildren[];
}

export const getForumThreadPosts = (threadId: string) => request<PaginationResponse<Post>>('get', `/forum/${threadId}`);

export type CreateForumPost = Post;

export const createForumPost = (threadId: string, data: { title: string; content?: string }) => request<CreateForumPost>('post', `/forum/${threadId}`, data);

export type UpdateForumPostData = { title?: string; content?: string }

export const updateForumPost = (threadId: string, postId: string, data: UpdateForumPostData) => request<CreateForumPost>('put', `/forum/${threadId}/${postId}`, data);

export const publishForumPost = (threadId: string, postId: string) => request<CreateForumPost>('put', `/forum/${threadId}/${postId}`, {
  status: ForumPostStatus.PUBLISHED,
});

export const publishForumPostComment = (postId: string, content: string) => request<Comment>('post', `/forum/comment`, {
  postId: postId,
  content: content
});

export const publishForumPostReply = (postId: string, content: string, replyTo: string) => request<Comment>('post', `/forum/comment`, {
  postId: postId,
  content: content,
  replyTo: replyTo
});

export const getForumPost = (threadId: string, postId: string) => request<Post>('get', `/forum/${threadId}/${postId}`);

export const getForumPostComments = (thread: string, postId: string) => request<Comment[]>('get', `/forum/${thread}/${postId}/comments`);