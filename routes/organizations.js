const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const request = require("request");

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  const encryptWithAES = (text, masterkey) => {
    return CryptoJS.AES.encrypt(text, masterkey).toString();
  };

  const decryptWithAES = (ciphertext, masterkey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterkey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };

  router.put("/:org_id/:pwd_id", (req, res) => {
    const { org_id, pwd_id } = req.params;
    dbHelpers.isUserAdmin(org_id, req.session.userId).then((admin) => {
      if (!admin) {
        return res
          .status(403)
          .send("You are not authorized to change the password!");
      }
      dbHelpers
        .getMasterkeyFromOrg(org_id)
        .catch((e) => e)
        .then((org) => {
          // Create a newPwd object from the form values passed in
          const newPwd = req.body;
          newPwd.id = pwd_id;

          //  Encrypt password
          const encryptedPwd = encryptWithAES(
            newPwd.website_pwd,
            org.masterkey
          );
          newPwd.website_pwd = encryptedPwd;

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
  });

  router.delete("/:org_id/:pwd_id", (req, res) => {
    const { org_id, pwd_id } = req.params;
    dbHelpers.isUserAdmin(org_id, req.session.userId).then((admin) => {
      if (!admin) {
        return res
          .status(403)
          .send("You are not authorized to delete the password!");
      }

      dbHelpers
        .deletePwd(pwd_id)
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
    let cookieUserID = "";
    let templateVars = {};
    if (!req.session.userId) {
      res.status(400).send("please login");
    } else {
      dbHelpers
        .getUserWithId(req.session.userId)
        .catch((e) => e)
        .then((user) => {
          templateVars["user"] = user;
          cookieUserID = user.id;
          return dbHelpers.getOrgsWithUserId(user.id).catch((e) => e);
        })
        .then((orgs) => {
          templateVars["orgs"] = orgs;
          return dbHelpers.doesOrgExist(org_id).catch((e) => e);
        })
        .then((doesOrgExistTrueOrNot) => {
          if (!doesOrgExistTrueOrNot) res.status(400).send("NO ORG");
          return dbHelpers.isUserAdmin(org_id, cookieUserID).catch((e) => e);
        })
        .then((isUserAdminTrueOrNot) => {
          templateVars["isUserAdminTrueOrNot"] = isUserAdminTrueOrNot;
          return dbHelpers.getPwdByOrgID(org_id, cookieUserID).catch((e) => e);
        })
        .then((pwds) => {
          if (!pwds) {
            templateVars["pwds"] = "";
          } else {
            dbHelpers
              .getMasterkeyFromOrg(org_id)
              .then((org) => {
                pwds.forEach((pwd) => {
                  pwd["website_pwd"] = decryptWithAES(
                    pwd["website_pwd"],
                    org.masterkey
                  );
                });
                templateVars["pwds"] = pwds;
                res.render("organization", templateVars);
              })
              .catch((e) => e);
          }
        })
        .catch((e) => e);
    }
  });

  const fetchCategory = function (url, cb) {
    //encode url
    request(
      `https://website-categorization.whoisxmlapi.com/api/v1?apiKey=at_zb2Fs3RVVNYJX7y5F8Nqyis2YUET6&domainName=${url}`,
      (error, response, body) => {
        let category = "";
        const data = JSON.parse(body);
        switch (data.categories[0]) {
          //ENTERTAINMENT
          case "Arts and Entertainment":
          case "Gambling":
          case "Games":
          case "Recreation and Hobbies":
          case "Home and Garden":
          case "Pets and Animals":
          case "Books and Literature":
          case "Beauty and Fitness":
          case "Autos and Vehicles":
            category = "entertainment";
            break;

          // BUSINESS
          case "Computer and electronics":
          case "Finance":
          case "Business and Industry":
          case "Travel":
          case "Law and Government":
            category = "business";
            break;

          // EDUCATIONAL
          case "Career and Education":
          case "Science":
          case "Reference":
          case "News and Media":
            category = "educational";
            break;

          // SHOPPING
          case "Food and Drink":
          case "Shopping":
            category = "shopping";
            break;

          // SOCIAL
          case "Health":
          case "Adult":
          case "Internet and Telecom":
          case "People and Society":
            category = "social";
            break;

          // SPORTS
          case "Sports":
            category = "sports";
            break;
        }

        cb(category);
      }
    );
  };

  router.post("/:org_id", (req, res) => {
    const { org_id } = req.params;
    const {
      website_title,
      website_url,
      website_username,
      website_pwd,
      category,
    } = req.body;
    if (!(website_title && website_url && website_username && website_pwd)) {
      return res.status(400).send("All fields must be filled in!");
    } else {
      // must remove http://www for fetchCategory
      fetchCategory(website_url, function (categoryIfNoneGiven) {
        dbHelpers.getMasterkeyFromOrg(org_id).then((org) => {
          const encryptPass = encryptWithAES(website_pwd, org.masterkey);
          if (category) {
            dbHelpers
              .addPwdToOrg(
                org_id,
                website_title,
                website_url,
                website_username,
                encryptPass,
                category
              )
              .then(() => {
                return res.redirect(`/orgs/${org_id}`);
              });
          } else {
            dbHelpers
              .addPwdToOrg(
                org_id,
                website_title,
                website_url,
                website_username,
                encryptPass,
                categoryIfNoneGiven
              )
              .then(() => {
                return res.redirect(`/orgs/${org_id}`);
              });
          }
        });
      });
    }
  });

  return router;
};
