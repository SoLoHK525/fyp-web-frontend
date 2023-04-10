import { request } from './_base';
import { User } from './auth';
import { Group } from './group';

export interface Project {
  id: string;
  name: string;
  owner: User;
  members?: User[];
  groups?: Group[];
}

type ExecutorStatus = 'pending' | 'running' | 'failed';

interface GetProjectExecutorDto {
  executor_id: string;
  status: ExecutorStatus;
  endpoint: string;
}

export const getProjectExecutor = (project_owner: string, project_name: string) => request<GetProjectExecutorDto>('get', `/project/${project_owner}/${project_name}/executor`);

interface CreateProjectSessionDto {
  user: User;
  project: Project;
  token: string;
  id: string;
  authenticated: boolean;
}

export const createProjectSession = (project_owner: string, project_name: string) => request<CreateProjectSessionDto>('post', `/project/${project_owner}/${project_name}/session`);

type GetAllUserProjectsDto = Project[];

export const getAllUserProjects = () => request<GetAllUserProjectsDto>('get', `/project`);