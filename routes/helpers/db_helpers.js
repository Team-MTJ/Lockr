const bcrypt = require("bcryptjs");

const generateRandomMasterkey = () => {
  const charPool =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+-=`;?/.,<>[]{}";

  let password = "";

  let i = 0;
  while (i < 20) {
    const randomCharIndex = Math.floor(Math.random() * charPool.length);
    const randomChar = charPool.charAt(randomCharIndex);
    password += randomChar;
    i++;
  }

  return password;
};

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
        SELECT users.first_name, users.last_name, users.email, membership.is_admin, users.id FROM users
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
        (name, masterkey)
        VALUES
        ($1, $2)
        RETURNING *;
        `,
        [org.name, generateRandomMasterkey()]
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
   * @param {integer} org_id id of the organization
   * @param {integer} user_id id of the user
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
    AND membership.is_active = true
    ORDER BY website_title;
    `,
        [org_id, user_id]
      )
      .then((res) => {
        return res.rows;
      })
      .catch((e) => console.error(e));
  };

  /**
   * Checks if an organization exist in database
   * @param {id: integer} org_id
   * @return {Promise<{}>} A promise to the user.
   */
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

  /**
   * Checks if a user is admin of the organization
   * @param {integer} org_id organization unique id
   * @param {integer} user_id user unique id
   * @return {Promise<{}>} A promise to the user.
   */
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

  /**
   * returns a list of organizations where user is admin of it
   * @param {integer} user_id user unique id
   * @return {Promise<{}>} A promise to the user.
   */
  const orgsWhereUserIsAdmin = function (user_id) {
    return db
      .query(
        `
      SELECT org.name, org_id FROM membership
      JOIN org ON org_id = org.id
      WHERE is_admin = true AND user_id = $1;
    `,
        [user_id]
      )
      .then((res) => res.rows)
      .catch((e) => console.error(e));
  };

  // Fixes omission of http:// at the beginning of urls
  const fixUrl = function (url) {
    const urlArray = url.split("://");
    if (urlArray[0] !== "http" || urlArray[0] !== "https") {
      if (urlArray.length === 1) {
        urlArray.unshift("http");
      } else {
        urlArray[0] = "http"; // In case http was misspelled
      }
    }
    return urlArray.join("://");
  };

  /**
   * returns a list of organizations where user is admin of it
   * @param {int: org, string: title, string: url, string: username, string: password, string: category} created_pwd parameters of the new passwords
   * @return {Promise<{}>} A promise to the user.
   */
  const addPwdToOrg = function (org, title, url, username, password, category) {
    url = fixUrl(url);
    const values = [org, title, url, username, password, category];
    let queryString = "";

    // Change queryString depending on if category was given
    if (!category) {
      values.pop();
      queryString = `
    INSERT INTO pwd (org_id, website_title, website_url, website_username, website_pwd) VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    } else {
      queryString = `
    INSERT INTO pwd (org_id, website_title, website_url, website_username, website_pwd, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    }
    return db
      .query(queryString, values)
      .then((res) => res.rows[0])
      .catch((e) => console.error(e));
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
        return res.rows[0];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * Deletes the user from membership table, removing the connection to the orgs
   * @param {integer} org_id organization unique id
   * @param {string} email user unique email
   * @return {Promise<{}>} A promise to the user.
   */
  const removeUserFromOrg = function (org_id, email) {
    return db
      .query(
        `
        SELECT id  FROM users
        WHERE email = $1;

        `,
        [email]
      )
      .then((res) => {
        const userID = res.rows[0].id;
        db.query(
          `
          DELETE FROM membership
          WHERE org_id = $1
          AND user_id = $2
          RETURNING *;
          `,
          [org_id, userID]
        )
          .then((res) => res.rows[0])
          .catch((e) => console.error(e));
      });
  };

  /**
   * removes a password
   * @param {integer} pwdId password unique id
   * @return {Promise<{}>} A promise to the user.
   */
  const deletePwd = function (pwdId) {
    return db
      .query(
        `
        DELETE FROM pwd
        WHERE id=$1
        RETURNING *;
        `,
        [pwdId]
      )
      .then((res) => {
        return res.rows[0];
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * creates a connection from user to organization by adding to membership table
   * @param {integer} org_id organization unique id
   * @param {integer} user_id user unique id
   * @return {Promise<{}>} A promise to the user.
   */
  const addUserToOrg = function (user_id, org_id) {
    return db
      .query(
        `
    INSERT INTO membership
    (user_id, org_id, is_admin)
    VALUES
    ($1, $2, false)
    RETURNING *;
    `,
        [user_id, org_id]
      )
      .catch((e) => console.error(e));
  };

  /**
   * checks if member is part of the organization
   * @param {integer} org_id organization unique id
   * @param {integer} user_id user unique id
   * @return {Promise<{}>} A promise to the user.
   */
  const isUserMemberOfOrg = function (user_id, org_id) {
    return db
      .query(
        `
      SELECT user_id, org_id FROM membership
      WHERE user_id = $1 AND org_id = $2;
    `,
        [user_id, org_id]
      )
      .then((res) => {
        if (res.rows.length > 0) return true;
        return false;
      })
      .catch((e) => console.error(e));
  };

  /**
   * updates the is_admin property in membership table to true
   * @param {integer} org_id organization unique id
   * @param {string} email user unique email
   * @return {Promise<{}>} A promise to the user.
   */
  const makeUserAdmin = function (org_id, email) {
    return db
      .query(
        `
      SELECT id  FROM users
      WHERE email = $1;

      `,
        [email]
      )
      .then((res) => {
        const userID = res.rows[0].id;
        db.query(
          `
        UPDATE membership
        SET is_admin = true
        WHERE org_id = $1
        AND user_id = $2;
        `,
          [org_id, userID]
        )
          .then((res) => res.rows[0])
          .catch((e) => console.error(e));
      });
  };

  const getMasterkeyFromOrg = function (org_id) {
    return db
      .query(
        `
      SELECT masterkey FROM org
      WHERE id = $1;
    `,
        [org_id]
      )
      .then((res) => res.rows[0])
      .catch((e) => console.error(e));
  };

  // Returns an array of username and passwords that a user has access to
  // when given a url
  const getLoginFromUrl = function (url, user_id) {
    return db
      .query(
        `
      SELECT name, website_username, website_pwd, masterkey
      FROM pwd
      JOIN org ON pwd.org_id=org.id
      JOIN membership ON membership.org_id=org.id
      JOIN users ON membership.user_id=users.id
      WHERE website_url LIKE $1
      AND users.id=$2::integer
      ORDER BY name;
      `,
        [`%${url}%`, user_id]
      )
      .then((res) => res.rows)
      .catch((e) => console.error(e));
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
    orgsWhereUserIsAdmin,
    modifyPwd,
    removeUserFromOrg,
    deletePwd,
    addUserToOrg,
    isUserMemberOfOrg,
    makeUserAdmin,
    getMasterkeyFromOrg,
    getLoginFromUrl,
  };
};
