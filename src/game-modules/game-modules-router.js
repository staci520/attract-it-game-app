const path = require('path')
const express = require('express')
const xss = require('xss')
const GameModuleService = require('./game-modules-service')

const gameModuleRouter = express.Router()
const jsonParser = express.json()

const serializeGameModule = gameModule => ({
  id: gameModule.id,
  game_id: gameModule.game_id,
  template_modules_id: gameModule.template_modules_id,
  notes: xss(gameModule.notes),
  status: gameModule.status
})

gameModuleRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    GameModuleService.getGameModules(knexInstance)
      .then(gameModules => {
        res.json(gameModules.map(serializeGameModule))
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
      .then(gameModule => {
        res
          .status(201)
          .json(serializeGameModule(gameModule))
      })
      .catch(next)
  })

gameModuleRouter
  .route('/:game-module_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.gameModule_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    GameModuleService.getGameModuleById(
      req.app.get('db'),
      req.params.gameModule_id
    )
      .then(gameModule => {
        if (!gameModule) {
          return res.status(404).json({
            error: { message: `GameModule doesn't exist` }
          })
        }
        res.gameModule = gameModule
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeGameModule(res.gameModule))
  })
  .delete((req, res, next) => {
    GameModuleService.deleteGameModule(
      req.app.get('db'),
      req.params.gameModule_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const gameModuleToUpdate = { title, completed }

    const numberOfValues = Object.values(gameModuleToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    GameModuleService.updateGameModule(
      req.app.get('db'),
      req.params.gameModule_id,
      gameModuleToUpdate
    )
      .then(updatedGameModule => {
        res.status(200).json(serializeGameModule(updatedGameModule[0]))
      })
      .catch(next)
  })

module.exports = gameModuleRouter