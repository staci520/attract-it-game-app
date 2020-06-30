require('dotenv').config()
const app = require('./app')
const { PORT, LIVE_DB_URL } = require('./config')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: LIVE_DB_URL
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})








