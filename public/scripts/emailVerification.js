$(() => {
  $(".register-button").click((event) => {
    event.preventDefault();
    registerEmail = $("#register-form").find("#registerEmail").val();
    $.post(
      `http://apilayer.net/api/check?access_key=05c4fc16024b99d205328b12f3945f68&email=${registerEmail}&smtp=0`,
      (data) => {
        const res = data;
        if (!res.mx_found) {
          console.log("Not found!");
        } else {
          $("#register-form").submit();
        }
      }
    );
  });
});
