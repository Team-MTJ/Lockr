$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users",
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  const $password = $("#open-pwd");
  $password.on("click", function () {
    $.ajax({
      url: "/passwords/:pwd_id",
      method: "GET",
      dataType: "json",
      success: (pwd) => {
        $("#pwd-info").html(pwd);
        $("#modal").modal("show");
      },
    });
  });
});
