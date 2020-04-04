// For Main page (before login and register) 
// For Home Page (first page when logged in)

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) =>{
    res.render("index");
  })

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  return router;
}