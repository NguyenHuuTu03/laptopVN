const unidecode = require("unidecode");
module.exports.convertToSlug = (string) => {
  const unideCodeSlug = unidecode(string).trim();
  const slug = unideCodeSlug.replace(/\s+/g, "-");
  return slug;
};

module.exports.convertRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
