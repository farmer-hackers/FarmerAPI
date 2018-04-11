import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { hashPassword, comparePassword } from '../../utils/modelUtils'

const GameSchema = mongoose.Schema

const gameSchema = new GameSchema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    perf: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    pass: String,
    creationDate: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean,
        required: true
    },
    nbGamers: {
        type: Number,
        min: 1,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    idDocker: {
        type: String/*,
        required: true,
        unique: true*/
    },
    url: {
        type: String/*,
        required: true,
        unique: true*/
    }
})

gameSchema.pre('save', function(next) {
    const game = this
    if (!game.isModified('pass')) return next()
    hashPassword(game, next)
})
gameSchema.pre('findOneAndUpdate', function(next) {
    const game = this._update
    if (!game.pass) return next()
    hashPassword(game, next)
})

gameSchema.methods.comparePassword = comparePassword

module.exports = mongoose.model('GameInstance', gameSchema)
