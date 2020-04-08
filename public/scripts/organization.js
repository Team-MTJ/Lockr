// Client-side javascript loaded into only organization.ejs
/**
 * Adds attribute timespwned=number to each .passWordBox <input> using haveibeenpwned API upon opening a modal
 * @param {String} password The password to check
 * @return {Number} How many times pwned according to API
 */
const addPwnedAttributeToPasswordBox = function ($passwordBox) {
  const password = $passwordBox.val();
  const hashedPassword = sha1(password).toUpperCase();
  const firstFiveHash = hashedPassword.slice(0, 5);
  const remainingHash = hashedPassword.slice(5, hashedPassword.length);
  $.ajax({
    url: `https://api.pwnedpasswords.com/range/${firstFiveHash}`,
    method: "GET",
    success: (data) => {
      // data is one string with remainingHash:noOfTimes on each line
      const rows = data.split(/\n|:/);
      const indexOfPassword = rows.indexOf(remainingHash);

      // Change timespwned attribute on the input class
      if (indexOfPassword === -1) {
        $passwordBox.attr("timespwned", 0);
        return 0;
      } else {
        const timesPwned = rows[indexOfPassword + 1];
        $passwordBox.attr("timespwned", timesPwned);
        return timesPwned;
      }
    },
    error: (e) => {
      console.log(e);
    },
  });
};

$(() => {
  // Add timespwned='number' to all .passwordBox <inputs> upon page load
  $(".passwordBox").each(function () {
    addPwnedAttributeToPasswordBox($(this));
  });

  // Test code for changing of attribute when change password button is clicked
  $(".change").on("click", function () {
    const $passwordBox = $(event.target).parents().siblings(".passwordBox");
    addPwnedAttributeToPasswordBox($passwordBox);
  });

  // Changes timespwned as passwordBox is being modified
  $(".passwordBox").on("keyup", function () {
    addPwnedAttributeToPasswordBox($(this));
  });
});
