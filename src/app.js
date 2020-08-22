//load external resources
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

//load config file
const { NODE_ENV } = require('./config')

//load error handler
const errorHandler = require('./middleware/error-handler')

//load specific routers
const todoRouter = require('./todo/todo-router')
const gamesRouter = require('./games/games-router')
const gameModulesRouter = require('./game-modules/game-modules-router')
const templateModulesRouter = require('./template-modules/template-modules-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

//create app object to be run by server
const app = express()

//set up morgan environment (this is an error reporter)
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

//add morgan, cors and helmet to app object above  
app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))

//allow website to make api calls between multiple domains
app.use(cors())

//basic security
app.use(helmet())

//tell server where view files live (public folder)
app.use(express.static('public'))

//connect routers to app object
app.use('/api/to-do', todoRouter)
app.use('/api/games', gamesRouter)
app.use('/api/game-modules', gameModulesRouter)
app.use('/api/template-modules', templateModulesRouter)
//register users
app.use('/api/users', usersRouter)
//login users
app.use('/api/auth', authRouter)
app.use(errorHandler)

//export app object to be used in server
module.exports = app