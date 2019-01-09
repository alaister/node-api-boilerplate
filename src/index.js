import { Model } from 'objection'
import knex from './db/knex'
import server from './server'

const PORT = parseInt(process.env.PORT || 4000, 10)

Model.knex(knex)

server.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`🚀 Server ready at http://localhost:${PORT}/`)
})
