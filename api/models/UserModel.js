import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { hashPassword, comparePassword } from '../../utils/modelUtils'

const UserSchema = mongoose.Schema

const userSchema = new UserSchema({
    name: {
        type: String,
        required: 'Kindly enter the name of the user'
    },
    email: {
        type: String,
        required: 'Enter the email of the user',
        lowercase: true,
        unique: true
    },
    pass: {
        type: String,
        required: 'Enter user\'s password'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function(next) {
    const user = this
    if (!user.isModified('pass')) return next()
    hashPassword(user, next)
})
userSchema.pre('findOneAndUpdate', function(next) {
    const user = this._update
    if (!user.pass) return next()
    hashPassword(user, next)
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    comparePassword(candidatePassword, this.pass, cb)
}

module.exports = mongoose.model('Users', userSchema)
