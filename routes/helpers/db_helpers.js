const bcrypt = require("bcrypt");

module.exports = (db) => {
  /**
   * Get a single user from the db given their email.
   * @param {String} email The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithEmail = function (email) {
    return db
      .query(
        `
        SELECT * FROM users
        WHERE email=$1
        LIMIT 1;
        `,
        [email]
      )
      .then((res) => {
        if (res.rows.length === 0) return null;
        return res.rows[0];
      });
  };

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
  const login = function (email, password) {
    return getUserWithEmail(email) //Test
      .then((user) => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  };

  /**
   * Add a new user to the database.
   * @param {{first_name: string, last_name:string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  const addUser = function (user) {
    return db
      .query(
        `
        INSERT INTO users
        (first_name, last_name, email, password)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;
        `,
        [
          user.first_name,
          user.last_name,
          user.email,
          bcrypt.hashSync(user.password, 12),
        ]
      )
      .then((res) => res.rows[0])
      .catch((e) => null);
  };

  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUserWithId = function (id) {
    return db
      .query(
        `
        SELECT * FROM users
        WHERE id=$1::integer
        LIMIT 1;
        `,
        [id]
      )
      .then((res) => {
        if (res.rows.length === 0) return null;
        return res.rows[0];
      });
  };

  /**
   * Get an array of orgs the user belongs to from the database
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getOrgsWithUserId = function (id) {
    if (!id) return null;
    return db
      .query(
        `
        SELECT * FROM users
        JOIN membership ON user_id=users.id
        JOIN org on org_id=org.id
        WHERE users.id=$1::integer AND is_active=true;
        `,
        [id]
      )
      .then((res) => {
        if (res.rows.length === 0) return null;
        return res.rows;
      })
      .catch((e) => {
        return e;
      });
  };

  /**
  /* Get a list of users from the given organization id.
   * @param {integer} org The org id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  const getUsersByOrg = function (id) {
    return db
      .query(
        `
        SELECT users.first_name, users.last_name, users.email FROM users
        JOIN membership ON users.id = user_id
        JOIN org ON org.id = org_id
        WHERE org.id = $1 AND is_active = true;
        `,
        [id]
      )
      .then((res) => res.rows)
      .catch((e) => console.error(e));
  };

  /**
   * Check password id against user id to make sure that user is allowed to access that password
   * @param {integer} user_id The id of the user.
   * @param {integer} pwd_id The id of the password.
   * @return {Promise<{}>} A promise to the user.
   */
  const checkAuthGetPwd = function (user_id, pwd_id) {
    return db
      .query(
        `
      SELECT * FROM users
      JOIN membership ON users.id = user_id
      JOIN org ON org.id = membership.org_id
      JOIN pwd ON pwd.org_id = org.id
      WHERE membership.user_id = $1 AND pwd.id = $2 AND membership.is_active = true
    `,
        [user_id, pwd_id]
      )
      .then((res) => {
        if (res.rows.length === 0) {
          return false;
        } else {
          return res.rows[0];
        }
      });
  };
  /**
   * Add a new org to the database.
   * @param {name: string} org
   * @param {name: string} user
   * @return {Promise<{}>} A promise to the user.
   */
  const addOrg = function (org, user) {
    return db
      .query(
        `
        INSERT INTO org
        (name)
        VALUES
        ($1)
        RETURNING *;
        `,
        [org.name]
      )
      .then((data) => {
        const newOrg = data.rows[0];
        // Make membership entry
        return db
          .query(
            `
          INSERT INTO membership
          (user_id, org_id, is_admin)
          VALUES
          ($1, $2, true)
          RETURNING *;
          `,
            [user.id, newOrg.id]
          )
          .then((res) => {
            return res.rows[0];
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  /**
   * Find passwords using org id and user id
   * @param {name: integer} org_id
   * @param {name: integer} user_id
   * @return {Promise<{}>} A promise to the user.
   */
  const getPwdByOrgID = function (org_id, user_id) {
    return db
      .query(
        `
    SELECT pwd.* , membership.is_active, membership.is_admin FROM pwd
    JOIN membership ON membership.org_id = pwd.org_id
    WHERE membership.org_id = $1::integer
    AND membership.user_id = $2::integer
    AND membership.is_active = true;
    `,
        [org_id, user_id]
      )
      .then((res) => {
        return res.rows;
      })
      .catch((e) => console.error(e));
  };

  const doesOrgExist = function (id) {
    return db
      .query(
        `
    SELECT * FROM org
    WHERE org.id = $1::integer
    `,
        [id]
      )
      .then((res) => {
        if (res.rows) return true;
        return false;
      });
  };

  const isUserAdmin = function (org_id, user_id) {
    return db
      .query(
        `
    SELECT * FROM membership
    WHERE org_id = $1::integer
    AND user_id = $2::integer
    AND is_admin = true;
    `,
        [org_id, user_id]
      )
      .then((res) => {
        if (res.rows.length > 0) {
          return true;
        }

        return false;
      });
  };

  const addPwdToOrg = function (org, title, url, username, password) {
    // Category not added yet (not sure about functionality with it)
    const values = [org, title, url, username, password];
    return db
      .query(
        `
    INSERT INTO pwd (org_id, website_title, website_url, website_username, website_pwd) VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `,
        values
      )
      .then((res) => res.rows[0])
      .catch((e) => console.log(e));
  };

  /**
   * Modify a password from the db given a new new_pwd object
   * @param {{id: Number, website_title: String, website_url: String, website_username: String, website_pwd: String, category: String}} new_pwd The new pwd object
   * @return {Promise<{}>} A promise to query the db
   */
  const modifyPwd = function (newPwd) {
    const queryParams = [];

    let queryString = `
    UPDATE pwd
    SET
    `;

    // Check which fields were passed in and need to be updated
    if (newPwd.website_title) {
      queryParams.push(newPwd.website_title);
      queryString += `website_title=$${queryParams.length}, `;
    }

    if (newPwd.website_url) {
      queryParams.push(newPwd.website_url);
      queryString += `website_url=$${queryParams.length}, `;
    }

    if (newPwd.website_username) {
      queryParams.push(newPwd.website_username);
      queryString += `website_username=$${queryParams.length}, `;
    }

    if (newPwd.website_pwd) {
      queryParams.push(newPwd.website_pwd);
      queryString += `website_pwd=$${queryParams.length}, `;
    }

    if (newPwd.category) {
      queryParams.push(newPwd.category);
      queryString += `category=$${queryParams.length}, `;
    }

    // Remove last comma
    queryString = queryString.slice(0, -2);

    // WHERE clause
    queryParams.push(newPwd.id);
    queryString += `
    WHERE id=$${queryParams.length}
    RETURNING *;`;

    return db
      .query(queryString, queryParams)
      .then((res) => {
        console.log(res);
        return res.rows[0];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    getUserWithEmail,
    login,
    addUser,
    getUserWithId,
    getUsersByOrg,
    getOrgsWithUserId,
    checkAuthGetPwd,
    addOrg,
    getPwdByOrgID,
    doesOrgExist,
    isUserAdmin,
    addPwdToOrg,
    modifyPwd,
  };
};
