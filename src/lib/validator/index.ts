import { isDate } from './is-date';
import { isEmail } from './is-email';
import { isFlowColor } from './is-flow-color';
import { isFlowIntervalType } from './is-flow-interval-type';
import { isFlowName } from './is-flow-name';
import { isFlowRepeatType } from './is-flow-repeat-type';
import { isFlowType } from './is-flow-type';
import { isHistoryComplete } from './is-history-complete';
import { isHistoryCount } from './is-history-count';
import { isPassword } from './is-password';
import { isVerifyCode } from './is-verify-code';

export const v = {
  isEmail,
  isVerifyCode,
  isPassword,
  isFlowColor,
  isDate,
  isFlowName,
  isFlowType,
  isHistoryComplete,
  isHistoryCount,
  isFlowIntervalType,
  isFlowRepeatType,
};
