const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Use for passwords already created, and for new passwords
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/password/:pwd", (req, res) => {
    // get user_id from req.session
    const { userId } = req.session;
    const password = req.params.pwd;
    if (dbHelpers.isAuthorized(userId, password)) {
      
    } else {
      return res.send("You do not have access to this password.");
    }
  });

  return router;
};
