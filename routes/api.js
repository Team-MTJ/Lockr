const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  // Test route to see if user is logged in
  router.get("/", (req, res) => {
    const passwordObj = { username: "username", password: "test" };
    if (!req.session.userId) return res.status(400).json(null);
    return res.json(passwordObj);
  });

  // Returns the password of the first url that the user has access to
  router.get("/:url", (req, res) => {
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
