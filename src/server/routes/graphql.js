import { errorHandler, execute } from 'graphql-api-koa'
import koaPlayground from 'graphql-playground-middleware-koa'
import Router from 'koa-router'
import dataloadersFactory from '../../dataloaders'
import schema from '../../graphql/schema'
import accountServiceFactory from '../../services/account'
import socialServiceFactory from '../../services/social'
import { graphqlDevErrorLogger } from '../../utils/errors'

const router = new Router()

router.get('/', koaPlayground({ endpoint: '/api/graphql' }))
router.post(
  '/',
  errorHandler(),
  graphqlDevErrorLogger,
  execute({
    schema,
    override(ctx) {
      const currentUser = ctx.state.user || null
      const dataloaders = dataloadersFactory()
      const accountService = accountServiceFactory({ currentUser, dataloaders })
      const socialService = socialServiceFactory({ currentUser, dataloaders })

      return {
        contextValue: {
          currentSession: ctx.session,
          currentUser,
          dataloaders,
          accountService,
          socialService,
        },
      }
    },
  })
)

export default router
