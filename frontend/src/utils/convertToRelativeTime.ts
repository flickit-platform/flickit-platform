import {
  formatDistanceToNow,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isSameWeek,
  isSameMonth,
} from "date-fns";

export const convertToRelativeTime = (dateString: any) => {
  const date = new Date(dateString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return "Today";
  } else if (isSameDay(date, subDays(now, 1))) {
    return "Yesterday";
  } else if (isSameWeek(date, now)) {
    return "This week";
  } else if (isSameWeek(date, subWeeks(now, 1))) {
    return "Last week";
  } else if (isSameMonth(date, now)) {
    return "This month";
  } else if (isSameMonth(date, subMonths(now, 1))) {
    return "Last month";
  } else {
    return formatDistanceToNow(date);
  }
};
