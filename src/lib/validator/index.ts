import { isChallengeColor } from './is-challenge-color';
import { isChallengeItemDailyRepeatType } from './is-challenge-item-daily-repeat-type';
import { isChallengeItemDays } from './is-challenge-item-days';
import { isChallengeItemIntervalType } from './is-challenge-item-interval-type';
import { isChallengeItemName } from './is-challenge-item-name';
import { isChallengeItemNotDailyRepeatType } from './is-challenge-item-not-daily-repeat-type';
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
  isChallengeItemIntervalType,
  isChallengeItemDailyRepeatType,
  isChallengeItemNotDailyRepeatType,
};
