import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import schema from './schema'

import loadJwtMiddleware from './middleware/loadJwt'
import makeActionsMiddleware from './middleware/makeActions'
import makeDataloadersMiddleware from './middleware/makeDataloaders'

import { tokenAutoRefreshExtension } from './extensions'

import indexRoutes from './routes/index'
import userRoutes from './routes/users'
import sessionRoutes from './routes/sessions'

const PORT = parseInt(process.env.PORT || 4000, 10)
const { NODE_ENV } = process.env

mongoose.connect(
  process.env.MONGODB_URI,
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
  .use(makeDataloadersMiddleware)

// Routes
app.use('/', indexRoutes)
app.use('/users', userRoutes)
app.use('/sessions', sessionRoutes)

const server = new ApolloServer({
  ...schema,
  context: ({ req }) => ({
    actions: req.actions,
    user: req.user,
    dataloaders: req.dataloaders,
    refreshedAccessToken: req.refreshedAccessToken,
  }),
  playground: {
    settings: {
      'editor.cursorShape': 'line',
    },
  },
  extensions: [tokenAutoRefreshExtension],
})

server.applyMiddleware({ app })
// Fix for ERR_HTTP_HEADERS_SENT error
app.use('/graphql', () => {})

// 404 Handler
app.use('*', (_req, res) => {
  res.status(404).send({ error: { message: 'Not found' } })
})

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
