import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import session from 'koa-session'
import uuidV4 from 'uuid/v4'
import CustomSessionStore from '../auth/CustomSessionStore'
import passport from '../auth/passport'
import authRouter from './routes/auth'
import graphqlRouter from './routes/graphql'
import indexRouter from './routes/index'
import sessionRouter from './routes/session'

const v1Router = new Router()
v1Router.use('/auth', authRouter.routes(), authRouter.allowedMethods())
v1Router.use(
  '/sessions',
  sessionRouter.routes(),
  sessionRouter.allowedMethods()
)

const router = new Router({ prefix: '/api' })

router.use('', indexRouter.routes(), indexRouter.allowedMethods())
router.use('/graphql', graphqlRouter.routes(), graphqlRouter.allowedMethods())
router.use('/v1', v1Router.routes(), v1Router.allowedMethods())

const app = new Koa()

app.proxy = true
app.keys = [process.env.APP_SECRET]

app
  .use(
    session(
      {
        key: 'app.sid',
        maxAge: 14 * 24 * 60 * 60 * 1000,
        genid: uuidV4,
        renew: true,
        ContextStore: CustomSessionStore,
      },
      app
    )
  )
  .use(bodyParser())
  .use(passport.initialize())
  .use(passport.session())
  .use(router.routes())
  .use(router.allowedMethods())

export default app
