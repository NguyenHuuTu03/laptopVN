module.exports.sortPrice = (products, sort) => {
  if (sort.price === 1) {
    products.sort((a, b) => {
      return a.newPrice - b.newPrice;
    });
  }

  if (sort.price === -1) {
    products.sort((a, b) => {
      return b.newPrice - a.newPrice;
    });
  }
};
