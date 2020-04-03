// For Main page (before login and register) 
// For Home Page (first page when logged in)

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/front", (req, res) => {
    res.render("front");
  });

  router.get("/home", (req, res) => {
    res.render("home");
  })
  return router;
}