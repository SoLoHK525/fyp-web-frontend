import { request } from './_base';
import { User } from './auth';
import { Project } from './project';

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

export const getUserProject = ({
    username,
    projectId
  }: getUserProjectParams
) => request<Project>('get', `/project/${username}/${projectId}`);