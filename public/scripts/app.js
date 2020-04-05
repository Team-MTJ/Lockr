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
$("#copy").on("click", function() {
  // Remove disable to allow copy function
  $('#passwordBox').prop("disabled", false);
  const $text = $("#passwordBox");
  $text.select();
  document.execCommand("copy");
  // Enable disable again
  $('#passwordBox').prop("disabled", true);
});