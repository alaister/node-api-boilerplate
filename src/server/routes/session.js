import Router from 'koa-router'
import accountServiceFactory from '../../services/account'
import {
  AuthenticationError,
  handleRestErrors,
  NotFoundError,
} from '../../utils/errors'

const router = new Router()

router.get('/', handleRestErrors, async ctx => {
  const accountService = accountServiceFactory({
    currentUser: ctx.state.user || null,
  })

  if (!ctx.state.user) throw new AuthenticationError()
  const sessions = await accountService.getPaginatedSessionsByidUser(
    {},
    ctx.state.user.id
  )

  ctx.body = {
    data: sessions.edges.map(s => ({
      ...s.node,
      currentSession: s.node.id === ctx.session.id,
      data: undefined,
      deleted: undefined,
      idUser: undefined,
    })),
  }
})

router.get('/:id', handleRestErrors, async ctx => {
  const accountService = accountServiceFactory({
    currentUser: ctx.state.user || null,
  })

  const session = await accountService.getSession({ id: ctx.params.id })
  if (!session) throw new NotFoundError()
  ctx.body = {
    data: {
      ...session,
      currentSession: session.id === ctx.session.id,
      data: undefined,
      deleted: undefined,
      idUser: undefined,
    },
  }
})

router.delete('/:id', handleRestErrors, async ctx => {
  const accountService = accountServiceFactory({
    currentUser: ctx.state.user || null,
  })

  await accountService.deleteSession(ctx.params.id)
  ctx.status = 204
})

export default router
