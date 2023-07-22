import express from 'express'
import * as insertRouter from '../controllers/insert'

const router = express.Router()

router.post('/', insertRouter.insert)

export default router
