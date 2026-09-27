module.exports.sortPrice = (products, sort) => {
  if (sort.price === 1) {
    products.sort((a, b) => {
      return a.price - b.price;
    });
  }

  if (sort.price === -1) {
    products.sort((a, b) => {
      return b.price - a.price;
    });
  }
};
