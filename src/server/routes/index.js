import Router from 'koa-router'

const router = new Router()

router.get('/', ctx => {
  ctx.body = { name: 'node-api-boilerplate API', version: '1.0.0' }
})

export default router
