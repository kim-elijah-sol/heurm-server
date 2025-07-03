import { deleteChallengeItem } from './challenge-item.delete';
import { getFlow } from './flow.get';
import { patchFlow } from './flow.patch';
import { postFlow } from './flow.post';

export const flow = {
  postFlow,
  getFlow,
  patchFlow,
  deleteChallengeItem,
};
