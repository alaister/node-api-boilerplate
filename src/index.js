import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import schema from './schema'
import loadJwtMiddleware from './middleware/loadJwt'
import makeActionsMiddleware from './middleware/makeActions'
import indexRoutes from './routes'

const PORT = parseInt(process.env.PORT || 4000, 10)
const { NODE_ENV } = process.env

mongoose.connect(
  process.env.MONGO_URL || 'mongodb://localhost:27017/node-api-boilerplate',
  { useNewUrlParser: true }
)
mongoose.set('debug', NODE_ENV !== 'production')

// Express configuration
const app = express()

app
  .disable('x-powered-by')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(loadJwtMiddleware)
  .use(makeActionsMiddleware)

// Routes
app.use('/', indexRoutes)

const server = new ApolloServer({
  ...schema,
  context: ({ req }) => ({ actions: req.actions, user: req.user }),
})

server.applyMiddleware({ app })

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/`)
  console.log(
    `🚀 GraphQL API ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 GraphQL Subscriptions ready at http://localhost:${PORT}${
      server.subscriptionsPath
    }`
  )
})
