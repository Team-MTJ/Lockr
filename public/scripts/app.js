$(() => {
  // const manageTable = $("#manage-table > tbody");

  // function loadTable() {
  //   $.ajax({
  //     url: "/manage",
  //     method: "GET",
  //     dataType: "JSON",
  //     success: (response) => {},
  //   });
  // }

  // $( ".inner" ).append( "<p>Test</p>" );

  $("#manageOrgs > a").on("click", function () {
    // Get org_id from data-id in html
    const org_id = $(this).data("id");
    $.ajax({
      url: "/manage/org",
      method: "POST",
      dataType: "JSON",
      data: { org_id },
      success: (data) => {
        const body = $("#manage-table").DataTable();
        body.clear();
        data.forEach((member) => {
          body.row.add([
            member.first_name,
            member.last_name,
            member.email
          ]).draw(false);
        })
      },
    });
  });

  /*         t.row.add( [
            counter +'.1',
            counter +'.2',
            counter +'.3',
            counter +'.4',
            counter +'.5'
        ] ).draw( false ); */

  /*           const markup = `
          <tr>
            <td>${member.first_name}</td>
          </tr>
          <tr>
            <td>${member.last_name}</td>
          </tr>
          <tr>
            <td>${member.email}</td>
          </tr>
          `
          $("#manage-table > tbody").append(markup) */
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
