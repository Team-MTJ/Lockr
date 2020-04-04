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

  return { getUserWithEmail, login, addUser, getUserWithId };
};
