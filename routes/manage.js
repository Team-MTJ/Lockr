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

  router.post("/orgs", (req, res) => {
    dbHelpers.getUsersByOrg(req.body.org_id).then((users) => {
      currentUser = req.session.userId;
      users.forEach((user) => {
        user["currentUser"] = currentUser;
      });
      console.log(users);
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
  // UPDATE ADMIN
  router.put("/:org_id/:email", (req, res) => {
    const userId = req.session.userId;
    const orgId = req.params.org_id;
    const updateUserEmail = req.params.email;
    //check if user is admin
    dbHelpers.isUserAdmin(orgId, userId).then((admin) => {
      if (!admin) {
        res.status(401).send("not authorized");
      }
      dbHelpers
        .makeUserAdmin(orgId, updateUserEmail)
        .then(() => {
          res.redirect("/manage");
        })
        .catch((e) => console.error(e));
    });
  });
  // Add new member to org
  router.post("/orgs/:org_id", (req, res) => {
    const { newuser } = req.body;
    const { org_id } = req.params;
    const { userId } = req.session;

    dbHelpers.isUserAdmin(org_id, userId).then((admin) => {
      if (!admin)
        return res
          .status(403)
          .send("You are not authorized to add members to this organization.");
      dbHelpers.getUserWithEmail(newuser).then((userExists) => {
        if (!userExists) res.status(400).send("This user does not exist.");
        dbHelpers.isUserMemberOfOrg(userExists.id, org_id).then((member) => {
          if (member)
            return res
              .status(400)
              .send("This user is already a member of this organization!");
          dbHelpers.addUserToOrg(userExists.id, org_id).then((newUser) => {
            res.send(newUser);
          });
        });
      });
    });
  });

  return router;
};
