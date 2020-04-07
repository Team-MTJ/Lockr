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

$(".submitGenerate").on("click", (data) => {
  let includeNumber = $(".includeNumbers").is(":checked");
  let includeSymbol = $(".includeSymbols").is(":checked");
  let slideNumber = $(".password_length").val();
  let options = {
    includeNumbers: includeNumber,
    includeSymbols: includeSymbol,
    length: slideNumber,
  };
  let generatedPassword = generateRandomPassword(options);
  $(".new_pwd").val(generatedPassword);
});

// const $passGen = $(".slideG").children(".passGen");
// LINE 94 to 101
$("#passGen").on("click", () => {
  console.log("Clicked");
  const $passBox = $(this).parent().siblings(".passwordBox");
  const $length = $(this).parent().find(".passLength");
  const $numberBool = $(this).parent().find(".passNumber");
  const $symbolBool = $(this).parent().find(".passSymbol");
  let includeNumber = $numberBool.is(":checked");
  console.log(includeNumber);
  let includeSymbol = $symbolBool.is(":checked");
  console.log(includeSymbol);
  let slideNumber = $length.val();
  console.log(slideNumber);
  let options = {
    includeNumbers: includeNumber,
    includeSymbols: includeSymbol,
    length: slideNumber,
  };
  let generatedPassword = generateRandomPassword(options);
  $passBox.prop("disabled", true);
  $passBox.val(generatedPassword);
});
