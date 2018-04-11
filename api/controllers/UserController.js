import Boom from 'boom'
import UserManager from '../mongoManager/UserManager'
import { simpleUser, comparePassword, getToken } from '../../utils/modelUtils'

exports.login = (req, reply) => {
    UserManager.findOne({ email: req.payload.email }, (err, user) => {
        if (err) return reply(err)
        if (!user) return reply(Boom.badRequest())
        user.comparePassword(req.payload.pass, (err, isMatch) => {
            if (err) return reply(err)
            const token = getToken(user.id)
            reply({ token: token, id: user.id }).header('Authorization', token)
        })
    })
}

exports.getUsers = (req, reply) => {
    UserManager.find({}, (err, user) => {
        if (err) return reply(err)
        const users = user.length ? user.map(o => simpleUser(o)) : user
        reply(users)
    })
}

exports.postUser = (req, reply) => {
    UserManager.save(req.payload, (err, user) => {
        if (err) return reply(err)
        reply(user)
    })
}

exports.getUser = (req, reply) => {
    UserManager.findById(req.params.id, (err, user) => {
        if (err) return reply(err)
        reply(simpleUser(user))
    })
}

exports.putUser = (req, reply) => {
    UserManager.findOneAndUpdate(req.params.id, req.payload, (err, user) => {
        if (err) return reply(err)
        reply(user)
    })
}

exports.deleteUser = (req, reply) => {
    UserManager.remove(req.params.id, (err, user) => {
        if (err) return reply(err)
        reply({ message: 'User successfully deleted' })
    })
}
