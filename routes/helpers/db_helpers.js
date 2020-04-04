module.exports = (db) => {
  const getUsers = () => {
    return db
      .query(`select * from users;`)
      .then((data) => {
        return data.rows;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  };

  return { getUsers };
};
