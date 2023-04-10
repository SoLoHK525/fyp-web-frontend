export default {
  login: "/login",
  register: "/register",
  projectPage: (owner: string, name: string) => `/${owner}/${name}`,
  userProfile: (username: string) => `/${username}`,
  forum: "/forum",
  home: "/",
  projects: "/projects",
  thread: (name: string) => `/forum/${name}`,
  post: (thread: string, post: string) => `/forum/${thread}/${post}`,
}