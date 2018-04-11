import swaggered from 'hapi-swaggered'
import swaggeredUI from 'hapi-swaggered-ui'
import jwt from 'jsonwebtoken'
import vision from 'vision'
import inert from 'inert'

require('dotenv').config()

const PORT = process.env.PORT || 3333
const HOST = process.env.HOST || '172.20.10.6'
const SECRET = process.env.AUTH_SECRET || 'SECRET'

const hapiConf = {
    port: PORT,
    host: HOST,
    routes: { cors: true },
    labels: ['api']
}

const swaggerConf = [
    vision,
    inert,
    {
        register: swaggered,
        options: {
            auth: false,
            info: {
                title: 'FARMER HACKERS API',
                description: 'API documentation for The farmer hackers API',
                version: '1.0'
            }
        }
    },
    {
        register: swaggeredUI,
        options: {
            title: 'FARMER HACKERS API',
            path: '/docs',
            auth: false,
            authorization: {
                field: 'apiKey',
                valuePrefix: 'bearer ',
                defaultValue: 'demoKey',
                placeholder: 'Enter your apiKey here'
            },
            swaggerOptions: {}
        }
    }
]

const jwtValidate = (token, request, callback) => {
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return callback(err)
        callback(null, true, decoded)
    })
}

const useAuthStrategy = server => {
    server.auth.strategy('jwt', 'jwt', {
        validateFunc: jwtValidate
    })
    server.auth.default('jwt')
}

export { swaggerConf, hapiConf, useAuthStrategy }
