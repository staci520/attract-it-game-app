//import external resources
const path = require('path')
const express = require('express')
const xss = require('xss')

//import local service
const TemplateModuleService = require('./template-modules-service')

//load router and jSon parser
const templateModuleRouter = express.Router()
const jsonParser = express.json()

//serialize template module data
const serializeTemplateModule = templateModule => ({
  id: templateModule.id,
  title: xss(templateModule.title),
  title_color: xss(templateModule.title_color),  
  description: xss(templateModule.description),
  sort_order: xss(templateModule.sort_order)
})

//define template module router (for all data)
templateModuleRouter
  .route('/')

  //read data router
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TemplateModuleService.getTemplateModules(knexInstance)
      .then(templateModules => {
        res.json(templateModules.map(serializeTemplateModule))
      })
      .catch(next)
  })

  //create new template module router 
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
      .then(templateModule => {
        res
          .status(201)
          .json(serializeTemplateModule(templateModule))
      })
      .catch(next)
  })

//define template module router for one item by ID
templateModuleRouter
  .route('/:template-module_id')

  //for all routes do this
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.templateModule_id))) {
      return res.status(404).json({
        error: { message: `Invalid id` }
      })
    }
    TemplateModuleService.getTemplateModuleById(
      req.app.get('db'),
      req.params.templateModule_id
    )
      .then(templateModule => {
        if (!template - module) {
          return res.status(404).json({
            error: { message: `TemplateModule doesn't exist` }
          })
        }
        res.templateModule = templateModule
        next()
      })
      .catch(next)
  })

  //read data by id
  .get((req, res, next) => {
    res.json(serializeTemplateModule(res.templateModule))
  })

  //delete data by id
  .delete((req, res, next) => {
    TemplateModuleService.deleteTemplateModule(
      req.app.get('db'),
      req.params.templateModule_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  //update data by id
  .patch(jsonParser, (req, res, next) => {
    const { title, completed } = req.body
    const templateModuleToUpdate = { title, completed }

    const numberOfValues = Object.values(templateModuleToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title' or 'completed'`
        }
      })

    TemplateModuleService.updateTemplateModule(
      req.app.get('db'),
      req.params.templateModule_id,
      templateModuleToUpdate
    )
      .then(updatedTemplateModule => {
        res.status(200).json(serializeTemplateModule(updatedTemplateModule[0]))
      })
      .catch(next)
  })

module.exports = templateModuleRouter