import express from 'express'

import { AuthenticationError, handleRestErrors } from '../utils/errors'

const router = express.Router()

router.get('/current', async (req, res) => {
  try {
    const user = await req.actions.user.currentUser()
    res.send({ data: user })
  } catch (err) {
    return handleRestErrors(res, err)
  }
})

router.post('/', async (req, res) => {
  try {
    const data = await req.actions.user.createUser(req.body)
    res.send({ data })
  } catch (err) {
    return handleRestErrors(res, err)
  }
})

export default router
