import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserDto from '../api/dto/UserDto'
import GameInstance from '../api/dto/GameInstanceDto'
import { SALT_WORK_FACTOR } from './constants'

require('dotenv').config()

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const simpleUser = user => new UserDto(user)
const simpleGameInstance = game => new GameInstance(game)

const hashPassword = (user, next) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.pass, salt, (err, hash) => {
            if (err) return next(err)
            user.pass = hash
            next()
        })
    })
}

const comparePassword = (candidatePassword, pass, cb) => {
    bcrypt.compare(candidatePassword, pass, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

const getToken = id => jwt.sign({ id: id }, SECRET, { expiresIn: 60 * 60 })

export { simpleUser, simpleGameInstance, hashPassword, comparePassword, getToken }
