const UserService = {
  getUsers(db) {
    return db
      .from('user')
      .select(
        'user.id',
        'user.title',
        'user.completed',
      )
  },
  getUserById(db, user_id) {
    return db
      .from('user')
      .select(
        'user.id',
        'user.title',
        'user.completed',
      )
      .where('user.id', user_id)
      .first()
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteUser(db, user_id) {
    return db('user')
      .where({'id': user_id})
      .delete()
  },
  updateUser(db, user_id, newUser) {
    return db('user')
      .where({id: user_id})
      .update(newUser, returning=true)
      .returning('*')
  }

}

module.exports = UserService