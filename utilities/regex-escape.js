// Regex function for search functionality
const escapeRegex = (string) =>
  string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// Exporting Function
module.exports = escapeRegex;
