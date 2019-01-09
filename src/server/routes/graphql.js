import { errorHandler, execute } from 'graphql-api-koa'
import koaPlayground from 'graphql-playground-middleware-koa'
import Router from 'koa-router'
import dataloadersFactory from '../../dataloaders'
import schema from '../../graphql/schema'
import Account from '../../models/Account'
import Profile from '../../models/Profile'

const router = new Router()

router.get('/', koaPlayground({ endpoint: '/api/graphql' }))
router.post(
  '/',
  errorHandler(),
  execute({
    schema,
    override: ctx => ({
      contextValue: {
        currentSession: ctx.session,
        currentUser: ctx.state.user || null,
        dataloaders: dataloadersFactory({ Account, Profile }),
      },
    }),
  })
)

export default router
