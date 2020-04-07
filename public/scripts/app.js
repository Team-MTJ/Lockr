$(() => {
  // Dynamically create membership table depending on organization clicked in dropdown menu
  $("#manageOrgs > a").on("click", function () {
    // Get org_id from data-id in html
    const org_id = $(this).data("id");
    $.ajax({
      url: "/manage/org",
      method: "POST",
      dataType: "JSON",
      data: { org_id },
      success: (data) => {
        $(".add-member").empty();
        $(".add-member").append(
          `<form action="POST" type="submit">
            <button data-org=${org_id} id="add-member" class="btn btn-primary">Add Member</button>
            <input type="email" placeholder="Email" name="newuser-email">
          </form>`
        );
        const body = $("#manage-table").DataTable();
        body.clear();
        // body.row.add([`<button id="add-member" class="btn btn-primary">Add Member</button>`, "", "", "", "",]).draw(false);
        data.forEach((member) => {
          body.row
            .add([
              member.first_name,
              member.last_name,
              member.email,
              `<tr>
                <td>
                <button class="btn btn-info" type="button" id="make-admin">Make Admin</button> 
                </td>
               </tr>`,
              `<tr>
                <button class="btn btn-danger" type="button" id="remove-member">Remove Member</button>
                </td>
              </tr>`,
            ])
            .draw(false);
        });
      },
    });
  });
});

$("#add-member").on("click", () => {});

// Copy to clipboard function for modal
$(".copy").on("click", function (event) {
  // Stop the copy button from submitting a PUT request
  event.preventDefault();

  // Remove disable to allow copy function
  const $passwordBox = $(".copy").parents().siblings(".passwordBox");
  $passwordBox.prop("disabled", false);
  $passwordBox.select();
  document.execCommand("copy");
  // Enable "disable" again
  $passwordBox.prop("disabled", true);
});
