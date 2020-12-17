require('dotenv').config()
const app = require('./app')
const { PORT,  DB_URL } = require('./config')
const knex = require('knex')

   const db = knex({
     client: 'pg',
     connection: DB_URL,
   })

app.set('db', db)
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

// Insert into users (id, userName, password, education, interests, city)
// values
// ('1','kingbumii', '$2y$12$4R1JkopQ4LgjXH27bUAV5OwezOQLoBP6Yv7mbd.Nv7V67yBSmepZq', 'Purple University', array ['skating', 'softball', 'listending to show tunes', 'knitting'], 'Gallifrey');