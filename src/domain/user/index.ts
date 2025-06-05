import { postLogin } from './login.post';
import { deleteLogout } from './logout.delete';
import { getProfile } from './profile.get';
import { patchProfile } from './profile.patch';
import { postRefresh } from './refresh.post';

export * from './login.post';
export * from './logout.delete';
export * from './profile.get';
export * from './refresh.post';

export const user = {
  postLogin,
  deleteLogout,
  postRefresh,

  getProfile,
  patchProfile,
};
