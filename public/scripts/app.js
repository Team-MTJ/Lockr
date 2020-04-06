$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users",
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });


});

// Copy to clipboard function for modal
$(".copy").on("click", function() {
  // Remove disable to allow copy function
  const $passwordBox = $(".copy").parents().siblings(".passwordBox");
  $passwordBox.prop("disabled", false);
  $passwordBox.select();
  document.execCommand("copy");
  // Enable "disable" again
  $passwordBox.prop("disabled", true);
});