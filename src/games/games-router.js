const path = require('path')
const express = require('express')
const xss = require('xss')
const GameService = require('./games-service')

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

    //get input from user
    const { user_id, goal, start_time, end_time, status } = req.body

    //if input valid, create payload to send to db
    let payload = { user_id, goal, start_time, end_time, status }
  
    //validate user input
    for (const [key, value] of Object.entries(payload))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    //using payload above, send to db    
    GameService.insertGame(
      req.app.get('db'),
      payload 
    )
      .then(game => {
        res
          .status(201)
          .json(game)
      })
      .catch(next)
  })

gameRouter
  .route('/:game_id')
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.game_id))) {
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