import { request } from './_base';
import { User } from './auth';
import { Project } from './user';

interface CreateProjectSessionDto {
  user: User,
  project: Project,
}

export const createProjectSession = (project_owner: string, project_name: string) => request('post', `/project/${project_owner}/${project_name}/session`);