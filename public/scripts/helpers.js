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

$(".passGen").on("click", (event) => {
  const $passwordBox = $(event.target).parent().siblings(".passwordBox");
  const $length = $(event.target).siblings().children(".passLength");
  const $numberBool = $(event.target).siblings(".passNumber");
  const $symbolBool = $(event.target).siblings(".passSymbol");
  let includeNumber = $numberBool.is(":checked");
  let includeSymbol = $symbolBool.is(":checked");
  let slideNumber = $length.val();
  let options = {
    includeNumbers: includeNumber,
    includeSymbols: includeSymbol,
    length: slideNumber,
  };
  let generatedPassword = generateRandomPassword(options);
  $passwordBox.prop("disabled", false);
  $passwordBox.val(generatedPassword);
});

// const slideGHTML = `
// <div class="slideG">
// <input type="text" class="passLength" /><span>LEngth</span>
// <input type="checkbox" class="passNumber" /><span>Number</span>
// <input type="checkbox" class="passSymbol" /><span>symbol</span>
// <a class="passGen btn btn-secondary btn-sm" id="passGen">GEN</a>
// </div>
// `;

// $(".modal").on("hidden.bs.modal", function (e) {
//   const $slideG = $(".modal")
//     .children(".modal-dialog")
//     .children(".modal-content")
//     .children(".modal-body")
//     .children(".slideG");
//   console.log($slideG.html());
//   $slideG.html(slideGHTML);
// });
