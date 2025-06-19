import { deleteChallengeItem } from './challenge-item.delete';
import { getChallengeItem } from './challenge-item.get';
import { patchChallengeItem } from './challenge-item.patch';
import { postChallengeItem } from './challenge-item.post';

export const challengeItem = {
  postChallengeItem,
  getChallengeItem,
  patchChallengeItem,
  deleteChallengeItem,
};
