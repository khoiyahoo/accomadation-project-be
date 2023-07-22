import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
require('dotenv').config()

export const registerService = ({ phone, password, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const secpass = await bcrypt.hash(password, salt)
      const response = await db.User.findOrCreate({
        where: { phone },
        defaults: {
          phone,
          name,
          password: secpass,
          id: v4(),
        },
      })
      const token =
        response[1] &&
        jwt.sign(
          { id: response[0].id, phone: response[0].phone },
          process.env.SECRET_KEY,
          { expiresIn: '2d' },
        )
      resolve({
        err: token ? 0 : 2,
        msg: token
          ? 'Register is successfully !'
          : 'Phone number has been already used !',
        token: token || null,
      })
    } catch (error) {
      reject(error)
    }
  })

export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { phone },
        raw: true,
      })
      const isCorrectPassword =
        response && bcrypt.compareSync(password, response.password)
      const token =
        isCorrectPassword &&
        jwt.sign(
          { id: response.id, phone: response.phone },
          process.env.SECRET_KEY,
          { expiresIn: '2d' },
        )
      resolve({
        err: token ? 0 : 2,
        msg: token
          ? 'Login is successfully !'
          : response
          ? 'Password is wrong !'
          : 'Phone number not found !',
        token: token || null,
      })
    } catch (error) {
      reject(error)
    }
  })
