// Copy to clipboard function for modal
const $passwordBox = $(".copy").parents().siblings(".passwordBox");
$(".copy").on("click", function (event) {
  // Stop the copy button from submitting a PUT request
  // Remove disable to allow copy function
  $passwordBox.prop("disabled", false);
  $passwordBox.select();
  document.execCommand("copy");
  // Enable "disable" again
  $passwordBox.prop("disabled", true);
});

//Display value on slide
$(".password_length").on("input change", function () {
  $(".length_span").html($(".password_length").val());
});

$(".change").on("click", () => {
  console.log("click");
  $passwordBox.prop("disabled", false);
});
