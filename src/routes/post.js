import express from 'express'
import * as postControllers from '../controllers/post'
import verifyToken from '../middlewares/verifyToken'

const router = express.Router()

router.get('/all', postControllers.getPosts)
router.get('/limit', postControllers.getPostsLimit)
router.get('/new-post', postControllers.getNewPosts)
router.get('/:id', postControllers.getOnePost)

router.use(verifyToken)

router.post('/create-new', postControllers.createNewPost)
export default router
