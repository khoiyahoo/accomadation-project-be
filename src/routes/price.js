import express from 'express'
import * as priceController from '../controllers/price'

const router = express.Router()

router.get('/all', priceController.getPriceController)

export default router
