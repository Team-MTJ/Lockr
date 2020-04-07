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
        const body = $("#manage-table").DataTable();
        body.clear();
        data.forEach((member) => {
          body.row
            .add([
              member.first_name,
              member.last_name,
              member.email,
              `<tr>
                <td>
                <input disabled type="hidden" class="to-delete-email" value="${member.email}" />
                <input disabled type="hidden" class="org-to-delete-from" value="${org_id}" />
                <button class="btn btn-info" type="button" id="make-admin">Make Admin</button>
                </td>
               </tr>`,
              `<tr>
                <input type="hidden" class="to-delete-email" value="${member.email}" />
                <input type="hidden" class="org-to-delete-from" value="${org_id}" />
                <button class="remove-member btn btn-danger" type="submit" id="remove-member">Remove Member</button>
                </td>
              </tr>`, //<----- Added two hidden disabled input to obtain the email and org_id
            ])
            .draw(false);
        });
      },
    });
  });
  //----------------------------------------
  $(document).on("click", ".remove-member", function (event) {
    const org_id = $(event.target).siblings(".org-to-delete-from").val();
    const toDeleteEmail = $(event.target).siblings(".to-delete-email").val();
    console.log(org_id);
    console.log(toDeleteEmail);
    // $.post(`/manage/${org_id}/${toDeleteEmail}?_method=DELETE`, function () {
    //   console.log("okay");
    // });
  });
});

//
// Copy to clipboard function for modal
$(".copy").on("click", function (event) {
  // Stop the copy button from submitting a PUT request
  event.preventDefault();
  // Remove disable to allow copy function
  const $passwordBox = $(event.target).parents().siblings(".passwordBox");
  $passwordBox.prop("disabled", false);
  $passwordBox.select();
  document.execCommand("copy");
  // Enable "disable" again
  $passwordBox.prop("disabled", true);
});

// Display value on slide for new password modal
$(".password_length").on("input change", function () {
  $(".length_span").html($(".password_length").val());
});

// Display value on slide for edit password modal
$(".passLength").on("input change", function (event) {
  $(event.target).siblings(".lengthSpan").html($(event.target).val());
});

$(".change").on("click", () => {
  const $passwordBox = $(event.target).parents().siblings(".passwordBox");
  $passwordBox.prop("disabled", false);

  // Slide down the generate password box
  $(event.target).parents().siblings(".change_generate").slideToggle();
});

$(".close-modal").on("click", () => {
  const $passwordBox = $(event.target).parents().siblings(".passwordBox");
  $passwordBox.prop("disabled", true);
});
