$(() => {
  $(".register-button").click((event) => {
    event.preventDefault();
    registerEmail = $("#register-form").find("#registerEmail").val();
    $.post(
      `http://apilayer.net/api/check?access_key=05c4fc16024b99d205328b12f3945f68&email=${registerEmail}&smtp=0`,
      (data) => {
        if (!data.mx_found) {
          console.log("Not found!");
        } else {
          $("#register-form").submit();
        }
      }
    );
  });
});
