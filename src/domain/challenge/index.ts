import { deleteChallenge } from './challenge.delete';
import { getChallenge } from './challenge.get';
import { patchChallenge } from './challenge.patch';
import { postChallenge } from './challenge.post';

export const challenge = {
  getChallenge,
  postChallenge,
  patchChallenge,
  deleteChallenge,
};
