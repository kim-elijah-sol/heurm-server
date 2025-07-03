import { deleteChallengeItem } from './challenge-item.delete';
import { patchChallengeItem } from './challenge-item.patch';
import { getFlow } from './flow.get';
import { postFlow } from './flow.post';

export const flow = {
  postFlow,
  getFlow,
  patchChallengeItem,
  deleteChallengeItem,
};
