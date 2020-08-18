const GameService = {
  getGames(db) {
    return db
      .from('games')
      .select('*')
  },
  getGameById(db, game_id) {
    return db
      .from('games')
      .select('*')
      .where('game.id', game_id)
      .first()
  },
  insertGame(db, newGame) {
    return db
      .insert(newGame)
      .into('games')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteGame(db, game_id) {
    return db('games')
      .where({'id': game_id})
      .delete()
  },
  updateGame(db, game_id, newGame) {
    return db('games')
      .where({id: game_id})
      .update(newGame, returning=true)
      .returning('*')
  }

}

module.exports = GameService