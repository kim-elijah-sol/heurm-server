import { deleteCancel } from './cancel.delete';
import { join } from './join';
import { postLogin } from './login.post';
import { deleteLogout } from './logout.delete';
import { getProfile } from './profile.get';
import { patchProfile } from './profile.patch';
import { postRefresh } from './refresh.post';
import { resetPassword } from './reset-password';

export const user = {
  postLogin,
  deleteLogout,
  postRefresh,

  getProfile,
  patchProfile,

  join,
  resetPassword,

  deleteCancel,
};
