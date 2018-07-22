import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send({ name: 'node-api-boilerplate API', version: '0.1.0' })
})

export default router
