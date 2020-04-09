"use strict";

// Returns the table body HTML according to contents of passwordList object
const getTableBodyHTML = function (passwordList) {
  if (!passwordList) return `<tr><td colspan="3">No passwords found</td></tr>`;
  if (passwordList === "unauthorized")
    return `<tr><td colspan="3">Please login to <a href="localhost:8080" target="_blank">Lockr</a> first!</td></tr>`;

  const markupArray = [];
  for (const password of passwordList) {
    const { name, website_username, website_pwd } = password;
    markupArray.push(`
    <tr>
      <td>${name}</th>
      <td>${website_username}</td>
      <td>${website_pwd}</td>
    </tr>
    `);
  }

  return markupArray.join("");
};

// Renders the table from data in chrome.storage.sync
const renderTable = function () {
  chrome.storage.sync.get("passwordList", function (data) {
    $("#pwd-tbody").html(getTableBodyHTML(data.passwordList));
  });
};

// document.ready
$(() => {
  renderTable();

  $("#getPwd").on("click", function (element) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;

      // Process URL
      // TODO
      $.ajax({
        url: "http://localhost:8080/api/",
        method: "GET",
        dataType: "JSON",
        success: (data) => {
          chrome.storage.sync.set({ passwordList: data });
          renderTable();
        },
        statusCode: {
          400: () => {
            chrome.storage.sync.set({ passwordList: "unauthorized" });
            renderTable();
          },
          404: () => {
            chrome.storage.sync.set({ passwordList: null });
            renderTable();
          },
        },
      });
    });
  });
});
