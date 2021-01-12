exports.capitalizeWord = function(word) {
  try {
    const newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
    return newWord;
  } catch (error) {
    return word;
  }
}

exports.isodateToString = function(date) {
  try {
    const stringDate = date.toISOString();
    console.log(stringDate);
    return stringDate.split('T')[0]
    
  } catch (error) {
    return date;
  }
}