import mongoose from 'mongoose'
import { emptyFunc } from '../../utils/utils'

const User = mongoose.model('Users')

exports.findAll = (then = emptyFunc) => {
    User.find({}, then)
}

exports.find = (user, then = emptyFunc) => {
    User.find(user, then)
}

exports.save = (user, then = emptyFunc) => {
    const newUser = new User(user)
    newUser.save(then)
}

exports.findById = (id, then = emptyFunc) => {
    User.findById(id, then)
}

exports.findOne = (user, then = emptyFunc) => {
    User.findOne(user, then)
}

exports.findOneAndUpdate = (id, user, then = emptyFunc) => {
    User.findOneAndUpdate({
        _id: id
    }, user, { new: true }, then)
}

exports.remove = (id, then = emptyFunc) => {
    User.remove({
        _id: id
    }, then)
}
