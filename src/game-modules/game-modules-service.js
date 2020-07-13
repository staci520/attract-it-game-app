const GameModuleService = {
  getGameModules(db) {
    return db
      .from('game-module')
      .select(
        'game-module.id',
        'game-module.title',
        'game-module.completed',
      )
  },
  getGameModuleById(db, game-module_id) {
    return db
      .from('game-module')
      .select(
        'game-module.id',
        'game-module.title',
        'game-module.completed',
      )
      .where('game-module.id', game-module_id)
      .first()
  },
  insertGameModule(db, newGameModule) {
    return db
      .insert(newGameModule)
      .into('game-module')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteGameModule(db, game-module_id) {
    return db('game-module')
      .where({'id': game-module_id})
      .delete()
  },
  updateGameModule(db, game-module_id, newGameModule) {
    return db('game-module')
      .where({id: game-module_id})
      .update(newGameModule, returning=true)
      .returning('*')
  }

}

module.exports = GameModuleService