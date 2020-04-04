const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/:org_id", (req, res) => {
    const { org_id } = req.params;
    if (!req.session.userId) {
      res.status(400).send("please login");
    } else {
      let cookieUser;
      dbHelpers
        .getUserWithId(req.session.userId)
        .then((user) => {
          cookieUser = user;
          dbHelpers
            .getPwdByOrgID(org_id, cookieUser.id)
            .then((data) => {
              if (!data) res.status(400).send("NO ORG OR NOT ACTIVE");
              else {
                let templateVars = { data: data, user: cookieUser };
                res.render("organization", templateVars);
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  });

  router.get("/:organization/manage", (req, res) => {
    res.render("manage");
  });

  return router;
};
