import mongoose from 'mongoose'
import { emptyFunc } from '../../utils/utils'

const Game = mongoose.model('GameInstance')

exports.findAll = (then = emptyFunc) => {
    Game.find({ public: true }, then)
}

exports.find = (game, then = emptyFunc) => {
    Game.find(game, then)
}

exports.save = (game, then = emptyFunc) => {
    const newGame = new Game(game)
    newGame.save(then)
}

exports.findById = (id, then = emptyFunc) => {
    Game.findById(id, then)
}

exports.findOneAndUpdate = (id, game, then = emptyFunc) => {
    Game.findOneAndUpdate({
        _id: id
    }, game, { new: true }, then)
}

exports.remove = (id, then = emptyFunc) => {
    Game.remove({
        _id: id
    }, then)
}
