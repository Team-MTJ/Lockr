const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.put("/:org_id/:pwd_id", (req, res) => {
    const { org_id, pwd_id } = req.params;
    dbHelpers.isUserAdmin(org_id, req.session.userId).then((admin) => {
      if (!admin) {
        return res
          .status(403)
          .send("You are not authorized to change the password!");
      }

      // Create a newPwd object from the form values passed in
      const newPwd = req.body;
      console.log(req.body);
      newPwd.id = pwd_id;

      // Delete keys that were not passed in through the form
      for (const key of Object.keys(newPwd)) {
        if (!newPwd[key]) {
          delete newPwd[key];
        }
      }

      dbHelpers
        .modifyPwd(newPwd)
        .then(() => {
          res.redirect(`/orgs/${org_id}`);
        })
        .catch((e) => res.send(e));
    });
  });

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
      dbHelpers.addOrg(org, user).then((data) => {
        return res.redirect(`/orgs/${data.org_id}`);
      });
    });
  });

  router.get("/:org_id", (req, res) => {
    const { org_id } = req.params;
    let templateVars = {};
    if (!req.session.userId) {
      res.status(400).send("please login");
    } else {
      dbHelpers.getUserWithId(req.session.userId).then((user) => {
        dbHelpers.getOrgsWithUserId(user.id).then((orgs) => {
          dbHelpers.doesOrgExist(org_id).then((doesOrgExistTrueOrNot) => {
            if (!doesOrgExistTrueOrNot) res.status(400).send("NO ORG");
            dbHelpers
              .isUserAdmin(org_id, user.id)
              .then((isUserAdminTrueOrNot) => {
                dbHelpers.getPwdByOrgID(org_id, user.id).then((pwds) => {
                  if (!pwds) {
                    templateVars = {
                      user,
                      orgs,
                      pwds: "",
                      isUserAdminTrueOrNot,
                    };
                  } else {
                    templateVars = { user, orgs, pwds, isUserAdminTrueOrNot };
                    res.render("organization", templateVars);
                  }
                });
              });
          });
        });
      });
    }

    router.post("/:org_id", (req, res) => {
      const { org_id } = req.params;
      const {
        website_title,
        website_url,
        website_username,
        website_pwd,
        category
      } = req.body;

      if (!(website_title && website_url && website_username && website_pwd)) {
        return res.status(400).send("All fields must be filled in!");
      } else {
        dbHelpers
          .addPwdToOrg(
            org_id,
            website_title,
            website_url,
            website_username,
            website_pwd,
            category
          )
          .then(() => {
            return res.redirect(`/orgs/${org_id}`);
          });
      }
    });
  });
  return router;
};
