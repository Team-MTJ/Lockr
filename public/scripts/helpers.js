/**
 * Generate a random password client-side given some options
 * @param {{length: Number, includeNumbers: Boolean, includeSymbols: Boolean }} options An options object
 * @return {String} The generated password
 */
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
let includeNumber;
let includeSymbol;
let slideNumber;
$(".submitGenerate").on("click", (data) => {
  includeNumber = $(".includeNumbers").is(":checked");
  includeSymbol = $(".includeSymbols").is(":checked");
  slideNumber = $(".password_length").val();
  let options = {
    includeNumbers: includeNumber,
    includeSymbols: includeSymbol,
    length: slideNumber,
  };
  let generatedPassword = generateRandomPassword(options);
  $(".new_pwd").val(generatedPassword);
});
