import { request } from './_base';
import { User } from './auth';

export const getUserProfile = (
  {
    username,
  }: {
    username: string;
  }) => request<User>('get', `/user/profile/${username}`);

export interface getUserProjectParams {
  username: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
}

export const getUserProject = ({
    username,
    projectId
  }: getUserProjectParams
) => request<Project>('get', `/project/${username}/${projectId}`);