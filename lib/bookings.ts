/* eslint-disable no-restricted-syntax */
import config from "./config";

export const getBookedDates = () => {
  const bookedDates = [];

  if (config.booked) {
    for (const [yearKey, yearValue] of Object.entries(config.booked)) {
      for (const [monthKey, monthValue] of Object.entries(yearValue)) {
        for (const day of monthValue) {
          bookedDates.push(
            new Date(Number(yearKey), Number(monthKey) - 1, day)
          );
        }
      }
    }
  }

  return bookedDates;
};
