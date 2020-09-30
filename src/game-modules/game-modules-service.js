const GameModuleService = {
  getGameModules(db) {
    return db
      .from('game_modules')
      .select('*')
  },
  getGameModuleById(db, gameModule_id) {
    return db
      .from('game_modules')
      .select('*')
      .where('id', gameModule_id)
      .first()
  },
  insertGameModule(db, newGameModule) {
    return db
      .insert(newGameModule)
      .into('game_modules')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteGameModule(db, gameModule_id) {
    return db('game_modules')
      .where({'id': gameModule_id})
      .delete()
  },
  updateGameModule(db, gameModule_id, newGameModule) {
    return db('game_modules')
      .where({id: gameModule_id})
      .update(newGameModule, returning=true)
      .returning('*')
  }

}

module.exports = GameModuleService