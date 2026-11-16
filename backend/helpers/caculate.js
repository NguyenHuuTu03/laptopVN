module.exports.priceNew = (price, discount) => {
  return Math.round(Number(price) * (1 - Number(discount) / 100));
};
