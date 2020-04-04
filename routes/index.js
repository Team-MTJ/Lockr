const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const dbHelpers = require("./helpers/db_helpers")(db);

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/login", (req, res) => {
    res.render("login");
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
        return res.send("Logged in!"); // Redirect to '/' later
      })
      .catch((e) => res.send(e));
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  router.post("/register", (req, res) => {
    const user = req.body;

    // Check if any fields were empty
    if (!(user.first_name && user.last_name && user.email && user.password)) {
      return res.status(400).send("You must fill in all the fields!");
    }

    dbHelpers.addUser(user).then((user) => {
      if (!user) {
        res.send({ error: "error" });
        return;
      }
      req.session.userId = user.id;
      res.send("Registered!"); // Redirect to '/' later
    });
  });

  return router;
};
