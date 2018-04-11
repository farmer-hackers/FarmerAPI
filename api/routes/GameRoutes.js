import Paths from '../conf/Paths'
import GameInstanceController from '../controllers/GameInstanceController'
import Joi from 'joi'

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: Paths.intern.game,
        handler: GameInstanceController.getGames,
        config: {
            auth: false,
            tags: ['api']
        }
    })

    server.route({
        method: 'GET',
        path: Paths.intern.getUserGame,
        handler: GameInstanceController.getUserGames,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'GET',
        path: Paths.intern.getGame,
        handler: GameInstanceController.getGame,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'DELETE',
        path: Paths.intern.getGame,
        handler: GameInstanceController.deleteGame,
        config: {
            auth: 'jwt',
            tags: ['api']
        }
    })

    server.route({
        method: 'POST',
        path: Paths.intern.game,
        handler: GameInstanceController.postGame,
        config: {
            auth: 'jwt',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string().min(4).required(),
                    pass: Joi.string().min(8),
                    perf: Joi.number().valid(0, 1, 2),
                    public: Joi.boolean().required(),
                    nbGamers: Joi.number().min(1).max(20).required(),
                    user: Joi.string().length(24).required()
                }
            }
        }
    })

    server.route({
        method: 'PUT',
        path: Paths.intern.getGame,
        handler: GameInstanceController.putGame,
        config: {
            auth: 'jwt',
            tags: ['api'],
            validate: {
                payload: {
                    pass: Joi.string().min(8),
                    perf: Joi.number().valid(0, 1, 2),
                    public: Joi.boolean(),
                    nbGamers: Joi.number().min(1).max(20)
                }
            }
        }
    })

    /*server.route({
        method: 'POST',
        path : Paths.intern.patientPost,
        handler: PatientController.postPatient,
        config: {
        auth: 'jwt',
            tags: ['api'],
            validate: {
                payload: {
                    lastname: Joi.string().min(1).required(),
                    firstname: Joi.string().min(1).required(),
                    securitynumber: Joi.string().min(15).max(15).required(),
                    criticality: Joi.string().valid('1', '2', '3', '4', '5').required(),
                    rhesus: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O-', 'O+').required(),
                    gender: Joi.string().valid('man','woman').required(),
                    id_hospital: Joi.number().integer().required(),
                    id_doctor: Joi.number().integer().required(),
                    birthdate: Joi.date().timestamp().required(),
                    organneeded: Joi.string().required()
                }
            }
        }
    })*/
}
