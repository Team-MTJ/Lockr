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
      url: "/passwords/:pwd_id",
      method: "GET",
      dataType: "json",
      success: (pwd) => {
        $("#PASSWORD INFO").html(pwd);
        $("#MODAL DIV").modal("show");
      },
    });
  });
});
