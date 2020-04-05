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

$("#copy").on("click", function() {
  console.log("WTF")
  const $text = $("#passwordBox");
  $text.select();
  document.execCommand("copy");
  alert("Copied the text: " + $text);
});