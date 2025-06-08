import { getChallengeItemByDate } from './challenge-item-by-date.get';
import { deleteChallengeItem } from './challenge-item.delete';
import { getChallengeItem } from './challenge-item.get';
import { patchChallengeItem } from './challenge-item.patch';
import { postChallengeItem } from './challenge-item.post';

export const challengeItem = {
  getChallengeItemByDate,
  postChallengeItem,
  getChallengeItem,
  patchChallengeItem,
  deleteChallengeItem,
};
