import { errorHandler, execute } from 'graphql-api-koa'
import koaPlayground from 'graphql-playground-middleware-koa'
import Router from 'koa-router'
import schema from '../../graphql/schema'

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
      },
    }),
  })
)

export default router
