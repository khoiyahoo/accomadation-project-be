import * as services from '../services/post'

export const getPosts = async (req, res) => {
  try {
    const response = await services.getPostsService()
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Fail at post controller: ' + error,
    })
  }
}

export const getPostsLimit = async (req, res) => {
  const { page, priceNumber, areaNumber, ...query } = req.query
  try {
    const response = await services.getPostsLimitService(page, query, {
      priceNumber,
      areaNumber,
    })
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at post controller: ' + error,
    })
  }
}
export const getNewPosts = async (req, res) => {
  try {
    const response = await services.getNewPostService()
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at post controller: ' + error,
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const { id } = req.params
    const response = await services.getOnePost(id)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at one post controller: ' + error,
    })
  }
}

export const createNewPost = async (req, res) => {
  try {
    const {
      categoryCode,
      title,
      description,
      priceNumber,
      areaNumber,
      label,
      ...payload
    } = req.body
    const { id } = req.user
    if (
      !id ||
      !categoryCode ||
      !title ||
      !description ||
      !priceNumber ||
      !areaNumber ||
      !label
    ) {
      return res.status(400).json({
        err: -1,
        msg: 'Missing input',
      })
    }
    const response = await services.createPost(req.body, id)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'Failed at one post controller: ' + error,
    })
  }
}
