import { getFlowWaveCount } from './flow-wave-count.get';
import { patchReorder } from './reorder.patch';
import { deleteWave } from './wave.delete';
import { getWave } from './wave.get';
import { patchWave } from './wave.patch';
import { postWave } from './wave.post';

export const wave = {
  postWave,
  patchWave,
  getWave,
  deleteWave,
  patchReorder,
  getFlowWaveCount,
};
