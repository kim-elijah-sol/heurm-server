import { deleteChallengeItem } from './challenge-item.delete';
import { patchChallengeItem } from './challenge-item.patch';
import { postChallengeItem } from './challenge-item.post';
import { getFlow } from './flow.get';

export const flow = {
  postChallengeItem,
  getFlow,
  patchChallengeItem,
  deleteChallengeItem,
};
