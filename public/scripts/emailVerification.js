$(() => {
  $(".register-button").click((event) => {
    event.preventDefault();
    registerEmail = $("#register-form").find("#registerEmail").val();
    $.post(
      `http://apilayer.net/api/check?access_key=05c4fc16024b99d205328b12f3945f68&email=${registerEmail}&smtp=0`,
      (data) => {
        if (!data.mx_found) {
          $(".email_alert").html(`
          <div class="alert alert-warning alert-dismissible fade show invalidEmail" role="alert">
          <strong>Invalid</strong> Email!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`);
        } else {
          $("#register-form").submit();
        }
      }
    );
  });
});
