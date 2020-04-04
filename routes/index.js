const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      const templateVars = { user };
      return res.render("index", templateVars);
    });
  });

  router.get("/login", (req, res) => {
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      // If user is already logged in and tried to go to /register
      if (user) {
        return res.status(400).send("Already logged in!");
      }

      const templateVars = { user };
      return res.render("login", templateVars);
    });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Error logging in!");
    }

    dbHelpers
      .login(email, password)
      .then((user) => {
        if (!user) {
          return res.status(400).send("Error logging in!");
        }
        req.session.userId = user.id;
        return res.redirect("/");
      })
      .catch((e) => res.send(e));
  });

  router.get("/register", (req, res) => {
    dbHelpers.getUserWithId(req.session.userId).then((user) => {
      // If user is already logged in and tried to go to /register
      if (user) {
        return res.status(400).send("Already registered!");
      }
      const templateVars = { user };
      return res.render("register", templateVars);
    });
  });

  router.post("/register", (req, res) => {
    const user = req.body;

    // Check if any fields were empty
    if (!(user.first_name && user.last_name && user.email && user.password)) {
      return res.status(400).send("You must fill in all the fields!");
    }

    dbHelpers.addUser(user).then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }
      req.session.userId = user.id;
      return res.redirect("/");
    });
  });

  router.post("/logout", (req, res) => {
    req.session.userId = null;
    return res.redirect("/");
  });
  return router;
};
