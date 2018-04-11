import Paths from '../conf/Paths'
import UserController from '../controllers/UserController'
import Joi from 'joi'

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: Paths.intern.user,
        handler: UserController.getUsers,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'GET',
        path: Paths.intern.getUser,
        handler: UserController.getUser,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'DELETE',
        path: Paths.intern.getUser,
        handler: UserController.deleteUser,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'POST',
        path : Paths.intern.user,
        handler: UserController.postUser,
        config: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: {
                    name: Joi.string().min(4).required(),
                    email: Joi.string().email().required(),
                    pass: Joi.string().min(8).required()
                }
            }
        }
    })

    server.route({
        method: 'POST',
        path : Paths.intern.login,
        handler: UserController.login,
        config: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    pass: Joi.string().min(8).required()
                }
            }
        }
    })

    server.route({
        method: 'PUT',
        path : Paths.intern.getUser,
        handler: UserController.putUser,
        config: {
            auth: 'jwt',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string().min(4),
                    pass: Joi.string().min(8)
                }
            }
        }
    })
}
