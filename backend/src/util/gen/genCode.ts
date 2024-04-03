export default function genCode(length: number = 6) {
  const numberString = "0123456789";

  let resultString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numberString.length);
    resultString += numberString[randomIndex];
  }

  return resultString;
}
