const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/new", (req, res) => {
    dbHelpers
      .getUserWithId(req.session.userId) // Get user id
      .then((user) => {
        if (!user) {
          return res.status(403).send("You are not authorized!");
        }

        dbHelpers
          .getOrgsWithUserId(user.id) // Get orgs
          .then((orgs) => {
            const templateVars = { user, orgs };
            return res.render("orgs_new", templateVars);
          });
      });
  });

  router.post("/new", (req, res) => {
    const org = req.body;
    dbHelpers.getUserWithId(req.session.userId).then((user) => {      
      dbHelpers.addOrg(org, user).then(() => {
        return res.send(`Successfully created ${org.name}`);
      });
    });
  });

  router.get("/:organization", (req, res) => {
    res.send("organization");
  });

  router.get("/:organization/manage", (req, res) => {
    res.render("manage");
  });

  return router;
};
