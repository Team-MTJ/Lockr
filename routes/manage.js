const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    if (!req.session.userId)
      return res.status(400).send("You must be logged in to continue.");
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      dbHelpers.getOrgsWithUserId(user.id).then((orgs) => {
        // If user has no orgs they're a part of of, redirect to "Create new org"
        if (!orgs) res.redirect("/orgs/new");
        // Only want to display orgs where they have admin rights on the manage page
        dbHelpers.orgsWhereUserIsAdmin(user.id).then((adminOrgs) => {
          if (adminOrgs.length === 0) {
            return res
              .status(400)
              .send(
                "You have no admin privileges in any organization that you belong to."
              );
          } else {
            const templateVars = { user, orgs, adminOrgs };
            res.render("manage", templateVars);
          }
        });
      });
    });
  });
  
  router.post("/org", (req, res) => {
    dbHelpers.getUsersByOrg(req.body.org_id).then(users => {
      res.json(users);
    })
  })

  return router;
};