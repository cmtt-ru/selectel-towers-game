const declineWord = (number: number, words: string[]) => {
  let result = `${number} `;

  if (number % 10 === 1 && number % 100 !== 11) {
    result += words[0];
  } else if ([2, 3, 4].indexOf(number % 10) > -1 && [12, 13, 14].indexOf(number % 100) < 0) {
    result += words[1];
  } else {
    result += words[2];
  }

  return result;
};

export default declineWord;
