export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getTwoUniqueRandomNumbers = (min: number, max: number) => {
  const num1 = randomIntFromInterval(min, max);
  let num2;

  do {
    num2 = randomIntFromInterval(min, max);
  } while (num1 === num2);

  return [num1, num2];
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const convertToTitleCase = (text: string) => {
  return text
    .split('-') // Split the string by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words with a space
};
