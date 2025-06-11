import { challengeItem } from './challenge-item';
import { deleteChallenge } from './challenge.delete';
import { getChallenge } from './challenge.get';
import { patchChallenge } from './challenge.patch';
import { postChallenge } from './challenge.post';
import { getOverview } from './overview.get';

export const challenge = {
  getChallenge,
  postChallenge,
  patchChallenge,
  deleteChallenge,
  getOverview,

  challengeItem,
};
