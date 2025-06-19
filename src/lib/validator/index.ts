import { isChallengeColor } from './is-challenge-color';
import { isChallengeItemDays } from './is-challenge-item-days';
import { isChallengeItemIntervalType } from './is-challenge-item-interval-type';
import { isChallengeItemName } from './is-challenge-item-name';
import { isChallengeItemRepeatType } from './is-challenge-item-repeat-type';
import { isChallengeItemType } from './is-challenge-item-type';
import { isChallengeTitle } from './is-challenge-title';
import { isDate } from './is-date';
import { isEmail } from './is-email';
import { isHistoryComplete } from './is-history-complete';
import { isHistoryCount } from './is-history-count';
import { isPassword } from './is-password';
import { isVerifyCode } from './is-verify-code';

export const v = {
  isEmail,
  isVerifyCode,
  isPassword,
  isChallengeTitle,
  isChallengeColor,
  isDate,
  isChallengeItemName,
  isChallengeItemType,
  isChallengeItemDays,
  isHistoryComplete,
  isHistoryCount,
  isChallengeItemIntervalType,
  isChallengeItemRepeatType,
};
