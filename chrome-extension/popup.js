// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

let changeColor = document.getElementById("changeColor");
let getPwd = document.getElementById("getPwd");
let pwdResult = document.getElementById("pwdResult");

chrome.storage.sync.get("color", function (data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

changeColor.onclick = function (element) {
  let color = element.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.backgroundColor = "' + color + '";',
    });
  });
};

getPwd.onclick = function (element) {
  pwdResult.innerHTML = "Button clicked";
  let request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8080/api/", true);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      //var data = JSON.parse(this.response);
      pwdResult.innerHTML=this.response;
    } else {
      // We reached our target server, but it returned an error
      pwdResult.innerHTML="Error!";
    }
  };

  request.onerror = function () {
    console.log("error");
  };

  request.send();
};
