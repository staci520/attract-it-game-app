const path = require('path')
const express = require('express')
const xss = require('xss')
const TemplateModuleService = require('./template-module-service')

const template-moduleRouter = express.Router()
const jsonParser = express.json()

const serializeTemplateModule = template-module => ({
  id: template-module.id,
  title: xss(template-module.title),
  completed: template-module.completed
})

template-moduleRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TemplateModuleService.getTemplateModules(knexInstance)
      .then(template-modules => {
        res.json(template-modules.map(serializeTemplateModule))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, completed = false } = req.body
    const newTemplateModule = { title }

    for (const [key, value] of Object.entries(newTemplateModule))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newTemplateModule.completed = completed;  

    TemplateModuleService.insertTemplateModule(
      req.app.get('db'),
      newTemplateModule
    )
      .then(template-module => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${template-module.id}`))
          .json(serializeTemplateModule(template-module))
      })
      .catch(next)
  })

template-moduleRouter
  .route('/:template-module_id')
  .all((req, res, next) => {
    if(isNaN(parseInt(req.params.template-module_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    TemplateModuleService.getTemplateModuleById(
      req.app.get('db'),
      req.params.template-module_id
    )
      .then(template-module => {
        if (!template-module) {
          return res.status(404).json({
            error: { message: `TemplateModule doesn't exist` }
          })
        }
        res.template-module = template-module
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeTemplateModule(res.template-module))
  })
  .delete((req, res, next) => {
    TemplateModuleService.deleteTemplateModule(
      req.app.get('db'),
      req.params.template-module_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const template-moduleToUpdate = { title, completed }

    const numberOfValues = Object.values(template-moduleToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    TemplateModuleService.updateTemplateModule(
      req.app.get('db'),
      req.params.template-module_id,
      template-moduleToUpdate
    )
      .then(updatedTemplateModule => {
        res.status(200).json(serializeTemplateModule(updatedTemplateModule[0]))
      })
      .catch(next)
  })

module.exports = template-moduleRouter