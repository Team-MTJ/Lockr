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
    dbHelpers.getUsersByOrg(req.body.org_id).then((users) => {
      res.json(users);
    });
  });
  //DELETE BASED ON email and org_id
  router.delete("/:org_id/:email", (req, res) => {
    const userId = req.session.userId;
    const orgId = req.params.org_id;
    const deleteUserEmail = req.params.email;
    //check if user is admin
    dbHelpers.isUserAdmin(orgId, userId).then((admin) => {
      if (!admin) {
        res.status(401).send("not authorized");
      }
      dbHelpers
        .removeUserFromOrg(orgId, deleteUserEmail)
        .then(() => {
          res.redirect("/manage");
        })
        .catch((e) => console.error(e));
    });
  });
  return router;
};
