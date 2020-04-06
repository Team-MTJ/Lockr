$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users",
  // }).done((users) => {
  //   for (user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });

  // Find #manageOrgs - assign event handler
  const manageTable = $("#manage-table > tbody");

  function loadTable() {
    $.ajax({
      url: "/manage",
      method: "GET",
      dataType: "JSON",
      success: (response) => {},
    });
  }

  $("#manageOrgs > a").on("click", function () {
    const org_id = $(this).data("id");
    $.ajax({
      url: "/manage/foobar",
      method: "POST",
      dataType: "JSON",
      data: { org_id },
      success: (response) => {
        console.log(response);
      },
    });
  });

  // Copy to clipboard function for modal
  $(".copy").on("click", function () {
    // Remove disable to allow copy function
    const $passwordBox = $(".copy").parents().siblings(".passwordBox");
    $passwordBox.prop("disabled", false);
    $passwordBox.select();
    document.execCommand("copy");
    // Enable "disable" again
    $passwordBox.prop("disabled", true);
  });
});
