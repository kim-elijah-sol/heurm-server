import { deleteWave } from './wave.delete';
import { getWave } from './wave.get';
import { patchWave } from './wave.patch';
import { postWave } from './wave.post';

export const wave = {
  postWave,
  patchWave,
  getWave,
  deleteWave,
};
