import Router from 'koa-router'
import passport from '../../auth/passport'
import User from '../../models/User'
import { formatUserValidationErrors } from '../../utils/errors'

const router = new Router()

router.post('/register', async ctx => {
  try {
    const user = await User.create(ctx.request.body)

    ctx.status = 201
    ctx.body = { data: { user: user.$omit('password'), userErrors: [] } }
  } catch (err) {
    ctx.status = 422
    ctx.body = { data: { user: null, ...formatUserValidationErrors(err) } }
  }
})

router.post('/login', ctx =>
  passport.authenticate('local', (_err, user, info) => {
    if (!user) {
      ctx.status = 401
      ctx.body = {
        data: { user: null, userErrors: [JSON.parse(info.message)] },
      }
    } else {
      ctx.body = { data: { user: user.$omit('password'), userErrors: [] } }
      return ctx.login(user)
    }
  })(ctx)
)

router.get('/logout', ctx => {
  ctx.logout()
  ctx.session = null
  ctx.body = { data: { user: null, userErrors: [] } }
})

export default router
