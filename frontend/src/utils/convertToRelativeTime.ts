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
    return "today";
  } else if (isSameDay(date, subDays(now, 1))) {
    return "yesterday";
  } else if (isSameWeek(date, now)) {
    return "thisWeek";
  } else if (isSameWeek(date, subWeeks(now, 1))) {
    return "lastWeek";
  } else if (isSameMonth(date, now)) {
    return "thisMonth";
  } else if (isSameMonth(date, subMonths(now, 1))) {
    return "lastMonth";
  } else {
    return formatDistanceToNow(date);
  }
};
