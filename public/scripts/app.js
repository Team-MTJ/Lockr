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
    // e.preventDefault();
    const title = $(this).data("title");
    // const a = $(this);
    // const modal = $("#modal");
    $("#title").val(title)
    $('#modal').modal('show');
  });

  $('#modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
  })



});

/*     $.getJSON('/passwords') + a.data("id"), function(data) {
      $("#title").val($(this).data('title'))
    } */

/*     $.ajax({
      url: "/passwords/:pwd_id",
      method: "GET",
      dataType: "json",
      success: (pwd) => {
        $("#pwd-info").html(pwd);
        $("#modal").modal("show");
      },
    }); */


  