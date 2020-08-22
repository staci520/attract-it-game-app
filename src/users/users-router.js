const express = require('express')
const path = require('path')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')


// All users
usersRouter
  .route('/')
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(user => {
        console.log('User:', user)
        res.json(user)
      })
      .catch(next)
  })

  //register new user
  .post(jsonBodyParser, (req, res, next) => {

    //get input from user
    const { user_name, password } = req.body

    console.log("user_name:", user_name, "password:", password);

    //validate input
    for (const field of ['user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    const passwordError = UsersService.validatePassword(password)

    console.log("password error:", passwordError);

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    //check if user name is duplicated
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {

        console.log("hasUserWithUserName:", hasUserWithUserName);

        //if user name is duplicated, show error
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        //encrypt password
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            console.log("hashedpassword", hashedPassword);

            //create new user payload that includes encrypted password
            const newUser = {
              user_name,
              password: hashedPassword,
            }

            //insert new user created into db
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                console.log("user:", user)
                res
                  .status(201)
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

// Individual users by id
usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    const { user_id } = req.params;
    UsersService.getById(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          return res
            .status(404)
            .send({ error: { message: `User doesn't exist.` } })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user))
  })
  .delete((req, res, next) => {
    const { user_id } = req.params;
    UsersService.deleteUser(
      req.app.get('db'),
      user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter