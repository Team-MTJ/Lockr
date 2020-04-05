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
      dbHelpers.addOrg(org, user).then((data) => {
        console.log(data);
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
    //   dbHelpers
    //     .getUserWithId(req.session.userId)
    //     .then((user) => {
    //       db.doesOrgExist
    //       dbHelpers
    //         .getOrgsWithUserId(user.id) // Get orgs
    //         .then((orgs) => {
    //           dbHelpers
    //             .getPwdByOrgID(org_id, user.id)
    //             .then((data) => {
    //               if (!data) res.status(400).send("NO ORG OR NOT ACTIVE");
    //               else {
    //                 let templateVars = { pwds: data, user, orgs };
    //                 res.render("organization", templateVars);
    //               }
    //             })
    //             .catch((e) => res.send(e));
    //         });
    //     })
    //     .catch((e) => res.send(e));
    // }
  });
  return router;
};
