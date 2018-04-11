import mongoose from 'mongoose'
import GameInstanceModel from '../models/GameInstanceModel'
import UserModel from '../models/UserModel'

require('dotenv').config()

exports.startDB = () => {
    mongoose.Promise = global.Promise
    mongoose.connect(process.env.MONGO_CON, {
      reconnectTries: 5,
      reconnectInterval: 2000,
      poolSize: 1,
      bufferMaxEntries: 0
    })
    .then(() => console.log('MongoDB Sucessfuly connected'))
    .catch(err => {
        console.log('Error when trying to connect to MongoDB')
        throw err.MongoNetworkError
    })
}
