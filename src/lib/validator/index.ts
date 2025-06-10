import { isChallengeColor } from './is-challenge-color';
import { isChallengeItemDays } from './is-challenge-item-days';
import { isChallengeItemName } from './is-challenge-item-name';
import { isChallengeItemType } from './is-challenge-item-type';
import { isChallengeTitle } from './is-challenge-title';
import { isDate } from './is-date';
import { isEmail } from './is-email';
import { isHistoryComplete } from './is-history-complete';
import { isHistoryCount } from './is-history-count';
import { isHistoryTargetCount } from './is-history-target-count';
import { isName } from './is-name';
import { isPassword } from './is-password';
import { isVerifyCode } from './is-verify-code';

export const v = {
  isEmail,
  isVerifyCode,
  isPassword,
  isName,
  isChallengeTitle,
  isChallengeColor,
  isDate,
  isChallengeItemName,
  isChallengeItemType,
  isChallengeItemDays,
  isHistoryComplete,
  isHistoryCount,
  isHistoryTargetCount,
};
