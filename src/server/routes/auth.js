import Router from 'koa-router'
import passport from '../../auth/passport'
import accountServiceFactory from '../../services/account'
import socialServiceFactory from '../../services/social'
import {
  formatUserValidationErrors,
  handleRestErrors,
  AuthenticationError,
} from '../../utils/errors'

const router = new Router()

router.get('/me', async ctx => {
  if (!ctx.state.user) ctx.throw(401)

  const socialService = socialServiceFactory({
    currentUser: ctx.state.user || null,
  })

  const profile = await socialService.getProfileByidUser(ctx.state.user.id)

  ctx.body = {
    data: {
      user: {
        ...ctx.state.user.$toJson(),
        profile: profile.$omit('idUser').$toJson(),
      },
    },
  }
})

router.post('/register', async ctx => {
  const accountService = accountServiceFactory({
    currentUser: ctx.state.user || null,
  })

  try {
    const user = await accountService.registerUser(ctx.request.body)

    ctx.status = 201
    ctx.body = {
      data: {
        user: {
          ...user.$omit('password').$toJson(),
          profile: user.profile.$omit('idUser').$toJson(),
        },
        userErrors: [],
      },
    }
  } catch (err) {
    ctx.status = 422
    ctx.body = {
      data: {
        user: null,
        ...formatUserValidationErrors(err),
      },
    }
  }
})

router.post('/login', ctx => {
  let userErrors = []
  if (!ctx.request.body.email)
    userErrors.push({ field: ['email'], message: 'Email is required' })

  if (!ctx.request.body.password)
    userErrors.push({ field: ['password'], message: 'Password is required' })

  if (userErrors.length > 0) {
    ctx.status = 422
    ctx.body = {
      data: {
        user: null,
        userErrors,
      },
    }
    return
  }

  return passport.authenticate('local', (_err, user, info) => {
    if (!user) {
      ctx.status = 401
      ctx.body = {
        data: {
          user: null,
          userErrors: [JSON.parse(info.message)],
        },
      }
    } else {
      ctx.body = { data: { user: user.$omit('password'), userErrors: [] } }
      return ctx.login(user)
    }
  })(ctx)
})

router.get('/logout', handleRestErrors, ctx => {
  if (!ctx.state.user) throw new AuthenticationError()

  ctx.logout()
  ctx.session = null
  ctx.body = { data: { user: null, userErrors: [] } }
})

export default router
