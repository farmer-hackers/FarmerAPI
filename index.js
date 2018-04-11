import Hapi from 'hapi'
import hapiauthjwt from 'hapi-auth-jwt-simple'
import { hapiConf, swaggerConf, useAuthStrategy } from './api/conf/serverConf'
import DbConf from './api/conf/dbConf'
import routes from './api/routes/routes'

require('dotenv').config()

/* Check .env file and variables */
if (!process.env.MONGO_CON) throw 'Make sure you defined MONGO_CON in your .env file'

/* Start MongoDB and Model importation */
DbConf.startDB()

/* Start Web server */
const server = new Hapi.Server()
server.connection(hapiConf)

/* Register for swagger documentation */
server.register(swaggerConf, {
    select: 'api'
}, err => {
    if (err) throw err
})

/* Register for auth checking */
server.register(hapiauthjwt, err => { if (err) throw err })
useAuthStrategy(server)

/* Adding routes to the Server */
routes(server)

/* Starting servers */
server.start(err => {
    if (err) throw err
    console.log('Server running at: ', server.info.uri)
})
