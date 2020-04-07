const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    if (!req.session.userId)
      return res.status(400).send("You must be logged in to continue.");
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      dbHelpers.getOrgsWithUserId(req.session.userId).then((orgs) => {
        // If user has no orgs they're a part of of, redirect to "Create new org"
        if (!orgs) res.redirect("/orgs/new");
        // Only want to display orgs where they have admin rights on the manage page
        dbHelpers.orgsWhereUserIsAdmin(req.session.userId).then((adminOrgs) => {
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

  // Add new member to org
  router.post("/:org_id", (req, res) => {
    const { newuser } = req.body;
    const { org_id } = req.params;
    dbHelpers.isUserAdmin(org_id, req.session.userId).then((admin) => {
      if (!admin)
        res
          .status(403)
          .send("You are not authorized to add members to this organization.");
      dbHelpers.getUserWithEmail(newuser).then((userExists) => {
        if (!userExists) res.status(400).send("This user does not exist.");
        dbHelpers.isUserMemberOfOrg(newuser, org_id).then((member) => {
          if (member)
            res
              .status(400)
              .send("This user is already a member of this organization!");
          dbHelpers.addUserToOrg(newuser, org_id).then(() => {
            dbHelpers.getUsersByOrg(org_id).then((users) => {
              res.json(users);
            });
          });
        });
      });
    });
  });

  return router;
};
