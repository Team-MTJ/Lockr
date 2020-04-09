const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);
  
  const decryptWithAES = (ciphertext, masterkey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterkey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };
  // Test route to see if user is logged in, then submit test JSON
  router.get("/", (req, res) => {
    const passwordObj = { name: "FBI", website_username: "username", website_pwd: "test" };
    const passwordObj2 = { name: "CIA", website_username: "username", website_pwd: "test" };
    if (!req.session.userId) return res.status(400).json(null);
    return res.json([passwordObj, passwordObj2]);
  });

  // Returns the password of the first url that the user has access to
  router.get("/:url", (req, res) => {
    const { url } = req.params;

    // Process the url
    let user;
    if (!req.session.userId) {
      res.status(400).json(null);
    } else {
      dbHelpers.getUserWithId(req.session.userId).then((userScoped) => {
        user = userScoped;
        return dbHelpers.getOrgsWithUserId(user.id).catch((e) => e);
      });
    }
  });
  return router;
};
