const GameService = {
  getGames(db) {
    return db
      .from('game')
      .select(
        'game.id',
        'game.title',
        'game.completed',
      )
  },
  getGameById(db, game_id) {
    return db
      .from('game')
      .select(
        'game.id',
        'game.title',
        'game.completed',
      )
      .where('game.id', game_id)
      .first()
  },
  insertGame(db, newGame) {
    return db
      .insert(newGame)
      .into('game')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteGame(db, game_id) {
    return db('game')
      .where({'id': game_id})
      .delete()
  },
  updateGame(db, game_id, newGame) {
    return db('game')
      .where({id: game_id})
      .update(newGame, returning=true)
      .returning('*')
  }

}

module.exports = GameService