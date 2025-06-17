type FilterOption = {
  day: string;
  startDate: Date;
  endDate: Date;
};

type ChallengeItem = {
  days: string[];
  startAt: Date;
  endAt: Date | null;
};

export const filterChallengeableItem =
  ({ day, startDate, endDate }: FilterOption) =>
  <T extends ChallengeItem>(item: T): boolean => {
    return (
      item.days.includes(day) &&
      item.startAt.valueOf() <= startDate.valueOf() &&
      (item.endAt === null ||
        (item.endAt && item.endAt.valueOf() >= endDate.valueOf()))
    );
  };
