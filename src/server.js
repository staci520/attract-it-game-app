//load external resources
require('dotenv').config()
const knex = require('knex')

//load app object from app.js
const app = require('./app')

//load port and live DB url from the config
const { PORT, LIVE_DB_URL } = require('./config')

//set up DB settings 
const db = knex({
  client: 'pg',
  connection: LIVE_DB_URL
})

//send DB settings to app to be able to use them
app.set('db', db)

//with app object completed, send to server to listen
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})








