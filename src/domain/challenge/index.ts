import { challengeItem } from './challenge-item';
import { getChallenge } from './challenge.get';
import { patchChallenge } from './challenge.patch';
import { postChallenge } from './challenge.post';

export const challenge = {
  getChallenge,
  postChallenge,
  patchChallenge,

  challengeItem,
};
