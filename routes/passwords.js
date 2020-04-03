// For Password display page
// For Password card (individual passwords)

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Use for passwords already created, and for new passwords
  // Everything on this page is the same other than the two input fields where a new password/site combo is made (see wireframe)
  // IF WE CAN GET MODAL WORKING THIS IS NOT NECESSARY - WILL BE PART OF HOME PAGE??
  router.get("/password", (req, res) => {
    res.render("password");
  })

  return router;
}