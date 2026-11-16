module.exports.checkAttributes = (attributes, type, targetValue) => {
  if (targetValue == null) return true;

  const normalize = (value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/,/g, "");

  const patterns = {
    ram: /^(ram|memory|bộnhớram)$/i,
    ssd: /^(ssd|storage|dunglượngổcứng|ổcứng)$/i,
  };

  const keyPattern = patterns[type];

  const checkValue = (value) => {
    if (value == null) return false;

    const text = normalize(value);
    const target = normalize(targetValue);

    const regex = new RegExp(`(^|[^0-9])${target}($|[^0-9])`, "i");

    return regex.test(text);
  };

  return attributes.some((attribute) => {
    if (!attribute) return false;

    const key = normalize(attribute.key);
    const value = attribute.value;

    return keyPattern.test(key) && checkValue(value);
  });
};
