import config from "./config";
import { numberOfNightsBetweenDates } from "./dates";

export const isWeekend = (date) =>
  !!(date.getDay() === 5 || date.getDay() === 6);

const getCustomPriceFromConfig = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (config.costs.custom[year]) {
    if (config.costs.custom[year][month]) {
      if (config.costs.custom[year][month][day]) {
        return config.costs.custom[year][month][day];
      }

      if (isWeekend(date) && config.costs.custom[year][month].default_weekend) {
        return config.costs.custom[year][month].default_weekend;
      }

      if (
        !isWeekend(date) &&
        config.costs.custom[year][month].default_weekday
      ) {
        return config.costs.custom[year][month].default_weekday;
      }
    }
  }

  return null;
};

export function getCost(date) {
  let price = config.costs.default_weekday;

  if (isWeekend(date)) {
    price = config.costs.default_weekend;
  }

  if (getCustomPriceFromConfig(date)) {
    price = getCustomPriceFromConfig(date);
  }

  return price;
}

export const totalCostOfStay = (startDate, endDate) => {
  let cost = 0;
  const nights = numberOfNightsBetweenDates(startDate, endDate);

  const { nights: mediumStayNights, discount: mediumStayDiscount } =
    config.costs.discounts.medium_stay;
  const { nights: longStayNights, discount: longStayDiscount } =
    config.costs.discounts.long_stay;

  const theDate = new Date(startDate);

  cost += getCost(startDate);

  while (theDate < endDate) {
    theDate.setDate(theDate.getDate() + 1);
    cost += getCost(theDate);
  }

  if (nights >= longStayNights) {
    cost -= cost * longStayDiscount;
  } else if (nights >= mediumStayNights) {
    cost -= cost * mediumStayDiscount;
  }

  cost += config.costs.service_fee;

  return cost;
};
