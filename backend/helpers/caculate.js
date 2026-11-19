module.exports.priceNew = (price, discount) => {
  return Math.round(Number(price) * (1 - Number(discount) / 100));
};

module.exports.formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "Liên hệ";
  }
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
};
