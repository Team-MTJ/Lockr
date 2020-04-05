const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Use for passwords already created, and for new passwords
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/:pwd_id", (req, res) => {
    const { userId } = req.session;
    const password = req.params.pwd_id;
    dbHelpers.checkAuthGetPwd(userId, password) .then((data) => {
      res.json( {data});
    })
    .catch((e) => console.error(e));
  });

  return router;
};