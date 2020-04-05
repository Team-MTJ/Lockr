const generateRandomPassword = (options) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "1234567890";
  const symbols = "~!@#$%^&*()_+-=`;?/.,<>[]{}";

  let charPool = ""; // The possible characters to be included in password
  charPool += letters;

  if (options.includeNumbers) {
    charPool += numbers;
  }

  if (options.includeSymbols) {
    charPool += symbols;
  }

  let password = "";

  for (let i = 0; i < options.length; i++) {
    const randomCharIndex = Math.floor(Math.random() * charPool.length);
    const randomChar = charPool.charAt(randomCharIndex);
    password += randomChar;
  }

  return password;
};
