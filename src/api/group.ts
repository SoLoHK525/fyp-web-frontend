import { User } from './auth';

export interface Group {
  id: string;
  name: string;
  identifier: string;
  description: string;
  owner: User;
  members: User[];
}