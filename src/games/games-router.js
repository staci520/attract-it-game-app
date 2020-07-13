const path = require('path')
const express = require('express')
const xss = require('xss')
const GameService = require('./game-service')

const gameRouter = express.Router()
const jsonParser = express.json()

const serializeGame = game => ({
  id: game.id,
  title: xss(game.title),
  completed: game.completed
})

gameRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    GameService.getGames(knexInstance)
      .then(games => {
        res.json(games.map(serializeGame))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, completed = false } = req.body
    const newGame = { title }

    for (const [key, value] of Object.entries(newGame))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newGame.completed = completed;  

    GameService.insertGame(
      req.app.get('db'),
      newGame
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(serializeGame(game))
      })
      .catch(next)
  })

gameRouter
  .route('/:game_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.game_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    GameService.getGameById(
      req.app.get('db'),
      req.params.game_id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeGame(res.game))
  })
  .delete((req, res, next) => {
    GameService.deleteGame(
      req.app.get('db'),
      req.params.game_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const gameToUpdate = { title, completed }

    const numberOfValues = Object.values(gameToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    GameService.updateGame(
      req.app.get('db'),
      req.params.game_id,
      gameToUpdate
    )
      .then(updatedGame => {
        res.status(200).json(serializeGame(updatedGame[0]))
      })
      .catch(next)
  })

module.exports = gameRouter