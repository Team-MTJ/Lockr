// Client-side javascript loaded into only organization.ejs
/**
 * Returns number of times password has been pwned using haveibeenpwned API
 * @param {String} password The password to check
 * @return {Number} How many times pwned according to API
 */
const timesPwned = function (password) {
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
      if (indexOfPassword === -1) {
        console.log(0);
      } else {
        console.log(rows[indexOfPassword + 1]);
      }
    },
    error: () => {
      return 0;
    },
  });
};

timesPwned("qwerty");
