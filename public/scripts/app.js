$(() => {
  function updateManagePage(org_id) {
    $.ajax({
      url: "/manage/orgs",
      method: "POST",
      dataType: "JSON",
      data: { org_id },
      success: (data) => {
        $(".add-member").empty();
        $(".add-member").append(
          `<form data-id=${org_id} class="member-form" action="/manage/orgs/${org_id}" method="POST" type="submit">
            <button class="btn btn-primary">Add Member</button>
            <input type="email" placeholder="Email" name="newuser">
          </form>`
        );
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
  }

  // Dynamically create membership table depending on organization clicked in dropdown menu
  $("#manage-orgs > a").on("click", function () {
    // Get org_id from data-id in html
    const org_id = $(this).data("id");
    updateManagePage(org_id);
  });

  // Add new member & 
  $(".add-member").on("click", ".member-form > button", function (e) {
    e.preventDefault();
    const org_id = $(".member-form").data("id");
    $.ajax({
      url: `/manage/orgs/${org_id}`,
      method: "POST",
      data: $(".member-form").serialize(),
      success: () => {
        updateManagePage(org_id);
      },
    });
  });

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
    $(event.target).parents().siblings(".change_generate").slideDown();
  });

  $(".close-modal").on("click", () => {
    const $passwordBox = $(event.target).parents().siblings(".passwordBox");
    $passwordBox.prop("disabled", true);
  });

  // Typing into title filter
  $("#title-filter").on("keyup", (event) => {
    // Reset category selector when typing starts
    $("#select-category").val("choose");

    const searchTerm = $("#title-filter").val();
    if (searchTerm) {
      // Hide every card first
      $(".pwd-card").addClass("hidden");

      // Show cards that match the search term
      $(`.pwd-card[title^='${searchTerm}' i]`).removeClass("hidden");
    } else {
      // Show every card if field is empty
      $(".pwd-card").removeClass("hidden");
    }
  });

  // Selecting category
  $("#select-category").change((event) => {
    // Reset title search box
    $("#title-filter").val("");

    const category = $(event.target).children("option:selected").val();
    if (category === "showall" || category === "choose") {
      $(".pwd-card").removeClass("hidden");
    } else {
      // Hide every card first
      $(".pwd-card").addClass("hidden");

      // Show cards that match the category
      $(`.pwd-card[category='${category}']`).removeClass("hidden");
    }
  });
});
