export default {
  costs: {
    default_weekday: 30, // default week day price
    default_weekend: 50, // for Friday and Saturday nights
    service_fee: 15,

    discounts: {
      medium_stay: {
        nights: 6,
        discount: 0.1,
      },
      long_stay: {
        nights: 29,
        discount: 0.3,
      },
    },

    custom: {
      2022: {
        8: {
          default_weekday: 70, // for the entire month of august, weekends are 70
          default_weekend: 170, // for the entire month of august, weekends are 70
          24: 100,
          25: 100,
        },
      },
    },
  },

  blocked: { 2022: { 9: [20, 21, 22] } }, // block these days in August
};
