const path = require('path')
const express = require('express')
const xss = require('xss')
const GameModuleService = require('./game-module-service')

const game-moduleRouter = express.Router()
const jsonParser = express.json()

const serializeGameModule = game-module => ({
  id: game-module.id,
  title: xss(game-module.title),
  completed: game-module.completed
})

game-moduleRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    GameModuleService.getGameModules(knexInstance)
      .then(game-modules => {
        res.json(game-modules.map(serializeGameModule))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, completed = false } = req.body
    const newGameModule = { title }

    for (const [key, value] of Object.entries(newGameModule))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newGameModule.completed = completed;  

    GameModuleService.insertGameModule(
      req.app.get('db'),
      newGameModule
    )
      .then(game-module => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game-module.id}`))
          .json(serializeGameModule(game-module))
      })
      .catch(next)
  })

game-moduleRouter
  .route('/:game-module_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.game-module_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    GameModuleService.getGameModuleById(
      req.app.get('db'),
      req.params.game-module_id
    )
      .then(game-module => {
        if (!game-module) {
          return res.status(404).json({
            error: { message: `GameModule doesn't exist` }
          })
        }
        res.game-module = game-module
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeGameModule(res.game-module))
  })
  .delete((req, res, next) => {
    GameModuleService.deleteGameModule(
      req.app.get('db'),
      req.params.game-module_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const game-moduleToUpdate = { title, completed }

    const numberOfValues = Object.values(game-moduleToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    GameModuleService.updateGameModule(
      req.app.get('db'),
      req.params.game-module_id,
      game-moduleToUpdate
    )
      .then(updatedGameModule => {
        res.status(200).json(serializeGameModule(updatedGameModule[0]))
      })
      .catch(next)
  })

module.exports = game-moduleRouter