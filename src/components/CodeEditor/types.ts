export interface Folder {
  id: string; //uuid
  name: string;
  files: File[];
  directories: Folder[];
}

export interface File {
  id: string; //uuid
  name: string;
}