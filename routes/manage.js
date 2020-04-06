const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    if (!req.session.userId)
      return res.status(400).send("You must be logged in to continue.");
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      dbHelpers.getOrgsWithUserId(user.id).then((memberOfAnyOrgs) => {
        if (!memberOfAnyOrgs) res.redirect("/orgs/new");
        // if memberOfAnyOrgs -> it is an array - check each for admin privileges and add to templateVars
        let orgsWhereUserIsAdmin = [];
        memberOfAnyOrgs.forEach(row => {
          dbHelpers.
        })
      });
    });
    res.render("manage");
  });
  return router;
};
