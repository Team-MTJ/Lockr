$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users",
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
  
  const $password = $("PASSWORD CARD PLACEHOLDER BUTTON");
  $password.on("click", function () {
    $.ajax({
      url: "/password/:pwd",
      method: "GET",
      dataType: "json",
      success: (data) => {
        return data;
      },
    });
  });
});
