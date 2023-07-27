import db from '../models'
import { Op } from 'sequelize'
import { v4 } from 'uuid'
import generateCode from '../ultis/generateCode'
import moment from 'moment'
export const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attributes',
            attributes: ['price', 'acreage', 'published', 'hashtag'],
          },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
        ],
        attributes: ['id', 'title', 'star', 'address', 'description'],
      })
      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Getting posts is failed.',
        response,
      })
    } catch (error) {
      reject(error)
    }
  })

export const getPostsLimitService = (
  page,
  query,
  { priceNumber, areaNumber },
) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1
      const queries = { ...query }
      if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
      if (areaNumber) queries.areaNumber = { [Op.between]: areaNumber }
      const response = await db.Post.findAndCountAll({
        where: queries,
        raw: true,
        nest: true,
        offset: offset * +process.env.LIMIT,
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attributes',
            attributes: ['price', 'acreage', 'published', 'hashtag'],
          },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
        ],
        attributes: ['id', 'title', 'star', 'address', 'description'],
      })
      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Getting posts is failed.',
        response,
      })
    } catch (error) {
      reject(error)
    }
  })

export const getNewPostService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        offset: 0,
        order: [['createdAt', 'DESC']],
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attributes',
            attributes: ['price', 'acreage', 'published', 'hashtag'],
          },
        ],
        attributes: ['id', 'title', 'star', 'createdAt'],
      })
      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Getting posts is failed.',
        response,
      })
    } catch (error) {
      reject(error)
    }
  })

export const getOnePost = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findOne({
        where: { id: id },
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.User,
            as: 'user',
            attributes: ['name', 'phone', 'zalo', 'fbUrl'],
          },
          {
            model: db.Attribute,
            as: 'attributes',
            attributes: ['price', 'acreage', 'published', 'hashtag'],
          },
        ],
        attributes: [
          'id',
          'title',
          'star',
          'address',
          'description',
          'priceNumber',
          'areaNumber',
        ],
      })
      resolve({
        err: response ? 0 : 1,
        msg: response ? 'OK' : 'Getting one post is failed.',
        response,
      })
    } catch (error) {
      reject(error)
    }
  })

export const createPost = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const attributesId = v4()
      const imagesId = v4()
      const overviewId = v4()
      const labelCode = generateCode(body.label)
      const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
      const currentDate = new Date()
      await db.Post({
        id: v4(),
        title: body.title || null,
        labelCode,
        attributesId,
        categoryCode: body.categoryCode || null,
        description: body.description || null,
        userId,
        overviewId,
        imagesId,
        areaCode: body.areaCode || null,
        priceCode: body.priceCode || null,
        provinceCode: body?.province.includes('Thành phố')
          ? generateCode(body?.province.replace('Thành phố ', ''))
          : generateCode(body?.province.replace('Tỉnh ', '')) || null,
        priceNumber: body.priceNumber,
        areaNumber: body.areaNumber,
      })
      await db.Attribute.create({
        id: attributesId,
        price:
          +body.priceNumber < 1
            ? `${+body.priceNumber * 1000000} đồng/tháng`
            : `${+body.priceNumber} triệu/tháng`,
        acreage: `${body.areaNumber} m2`,
        published: moment(new Date()).format('DD/MM/YYYY'),
        hashtag,
      })
      await db.Image.create({
        id: imagesId,
        image: JSON.stringify(body.images),
      })
      await db.Overview.create({
        id: overviewId,
        code: hashtag,
        area: body?.label,
        type: body?.category,
        target: body?.target,
        bonus: 'Tin thường',
        created: new Date(),
        expired: currentDate.setDate(currentDate.getDate() + 10),
      })
      await db.Province.findOrCreate({
        where: {
          [Op.or]: [
            { value: body?.province.replace('Thành phố ', '') },
            { value: body?.province.replace('Tỉnh ', '') },
          ],
        },
        defaults: {
          code: body?.province.includes('Thành phố')
            ? generateCode(body?.province.replace('Thành phố ', ''))
            : generateCode(body?.province.replace('Tỉnh ', '')),
          value: body?.province.includes('Thành phố')
            ? body?.province.replace('Thành phố ', '')
            : body?.province.replace('Tỉnh ', ''),
        },
      })
      await db.Label.findOrCreate({
        where: {
          code: labelCode,
        },
        defaults: {
          code: labelCode,
          value: body.label,
        },
      })
      resolve({
        err: 0,
        msg: 'OK',
      })
    } catch (error) {
      reject(error)
    }
  })
