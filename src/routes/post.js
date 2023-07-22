import express from 'express'
import * as postControllers from '../controllers/post'

const router = express.Router()

router.get('/all', postControllers.getPosts)
router.get('/limit', postControllers.getPostsLimit)
router.get('/new-post', postControllers.getNewPosts)

export default router
