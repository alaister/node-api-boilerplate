import Router from 'koa-router'
import Session from '../../models/Session'

const router = new Router()

router.get('/', async ctx => {
  if (!ctx.state.user) ctx.throw(401)
  else {
    const sessions = await ctx.state.user.findSessions()

    ctx.body = {
      data: sessions.map(s => ({
        ...s,
        currentSession: s.id === ctx.session.id,
        data: undefined,
        deleted: undefined,
        accountId: undefined,
      })),
    }
  }
})

router.get('/:id', async ctx => {
  if (!ctx.state.user) ctx.throw(401)

  const session = await Session.findOne({ id: ctx.params.id })

  if (!session) ctx.throw(404)

  if (ctx.state.user.id !== session.accountId) ctx.throw(403)

  ctx.body = {
    data: {
      ...session,
      currentSession: session.id === ctx.session.id,
      data: undefined,
      deleted: undefined,
      accountId: undefined,
    },
  }
})

router.delete('/:id', async ctx => {
  if (!ctx.state.user) ctx.throw(401)

  const session = await Session.findOne({ id: ctx.params.id })

  if (!session) ctx.throw(404)

  if (ctx.state.user.id !== session.accountId) ctx.throw(403)

  await Session.delete(ctx.params.id)
  ctx.status = 204
})

export default router
