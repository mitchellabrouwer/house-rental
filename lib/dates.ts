import config from "./config";

export const isBlocked = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (config.blocked[year]) {
    if (config.blocked[year][month]) {
      if (config.blocked[year][month].findIndex((el) => el === day) !== -1) {
        return true;
      }
    }
  }

  return false;
};

export const isBooked = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (config.booked[year]) {
    if (config.booked[year][month]) {
      if (config.booked[year][month].findIndex((el) => el === day) !== -1) {
        return true;
      }
    }
  }

  return false;
};

export const isPast = (date) => {
  const now = new Date();
  if (date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0) >= 0) {
    return false;
  }
  return true;
};

export const numberOfNightsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate); // clone
  const end = new Date(endDate); // clone
  let dayCount = 0;

  while (end > start) {
    dayCount += 1;
    start.setDate(start.getDate() + 1);
  }

  return dayCount;
};

export const isDaySelectable = (day) =>
  !isPast(day) &&
  !isBlocked(day) &&
  !isBooked(day) &&
  numberOfNightsBetweenDates(new Date(), day) <= 30 * 6;
