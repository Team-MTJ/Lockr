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
        // if memberOfAnyOrgs -> check each for admin privileges and add to array
        // Only want to display orgs where they have admin rights on the manage page
        let orgsWhereUserIsAdmin = [];
        // console.log(orgs);
        orgs.forEach((row) => {
          // console.log("***", row, "***")
          // console.log("ORG ID", row.org_id)
          // console.log("USER ID", row.user_id)
          if (row.is_admin) {
            orgsWhereUserIsAdmin.push(row);
          }
          // dbHelpers.isUserAdmin(row.org_id, row.user_id).then(adminOrNot => {
          //   orgsWhereUserIsAdmin.push(adminOrNot);
          // })
        });
        console.log(orgsWhereUserIsAdmin);
        // console.log(orgsWhereUserIsAdmin);
        if (orgsWhereUserIsAdmin.length === 0) {
          return res
            .status(400)
            .send(
              "You have no admin privileges in any organization that you belong to."
            );
        } else {
          dbHelpers.getUsersByOrg
          const templateVars = { user, orgsWhereUserIsAdmin, orgs };
          res.render("manage", templateVars);
        }
      });
    });
  });
  return router;
};
