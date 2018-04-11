import GameManager from '../mongoManager/GameInstanceManager'
import { simpleGameInstance } from '../../utils/modelUtils'
import fetch from 'node-fetch'

require('dotenv').config()

const DOCKER_IP = process.env.DOCKER_IP || '172.20.10.4'
const DOCKER_PORT = process.env.DOCKER_PORT || '1234'

const catchErr = err => {
    console.log(err)
    reply(err)
}

exports.getGames = (req, reply) => {
    GameManager.find({}, (err, games) => {
        if (err) return reply(err)
        reply(games)
    })
}

exports.getUserGames = (req, reply) => {
    GameManager.find({ user: req.params.id }, (err, games) => {
        if (err) return reply(err)
        reply(games)
    })
}

exports.postGame = (req, reply) => {
    const game = req.payload
    const getHostConfig = conf => {
        switch (conf) {
            case 0:
                return 750000000
            case 1:
                return 1024000000
            case 2:
                return 2048000000
            default:
                return 750000000
        }
    }
    const env = [
        'PORT=8081',
        `PUBLIC_INSTANCE=${game.public ? 1 : 0}`,
        `NB_PLAYERS=${game.nbGamers}`,
        `GAME_NAME=${game.name}`
    ]
    if (!game.public) {
        env.push(`PASSWORD=${game.pass}`)
    }
    const body = {
        Hostname:  game.name,
        CmD: ['npm', 'start'],
        image: 'nodejs:nodejstag',
        HostConfig: {
            Memory: getHostConfig(game.perf)
        },
        Env: env
    }
    fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (res.status !== 200 && res.status !== 201) {
            console.log(res.status)
            throw new Error(res.status)
        }
        return res.json()
    })
    .then(json => {
        game.idDocker = json.Id
        fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${json.Id}/start`, {
            method: 'POST'
        })
        .then(res => {
            if (res.status < 200 || res.status >= 300) {
                console.log(res.status)
                throw new Error(res.status)
            }
        })
        .then(() => {
            fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${json.Id}/json`)
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    console.log(res.status)
                    throw new Error(res.status)
                }
                return res.json()
            })
            .then(container => {
                const ip = container.NetworkSettings.IPAddress
                const port = parseInt(ip.split('.')[ip.split('.').length -1]) -1
                game.url = `172.20.10.4:100${port}`
                GameManager.save(game, (err, game) => {
                    if (err) return reply(err)
                    reply(game)
                })
            })
            .catch(catchErr)
        })
        .catch(catchErr)
    })
    .catch(catchErr)
}

exports.getGame = (req, reply) => {
    GameManager.findById(req.params.id, (err, game) => {
        if (err) return reply(err)
        reply(simpleGameInstance(game))
    })
}

exports.putGame = (req, reply) => {
    const newgame = req.payload
    const getHostConfig = conf => {
        switch (conf) {
            case 0:
                return 750000000
            case 1:
                return 1024000000
            case 2:
                return 2048000000
            default:
                return 750000000
        }
    }
    GameManager.findById(req.params.id, (err, game) => {
        const env = [
            'PORT=8081',
            `PUBLIC_INSTANCE=${(newgame.public ? 1 : 0) || game.public}`,
            `NB_PLAYERS=${newgame.nbGamers || game.nbGamers}`,
            `GAME_NAME=${newgame.name || game.name}`
        ]
        if (!newgame.public) {
            env.push(`PASSWORD=${newgame.pass || game.pass}`)
        }
        const body = {
            Hostname:  game.name,
            CmD: ['npm', 'start'],
            image: 'nodejs:nodejstag',
            HostConfig: {
                Memory: getHostConfig(newgame.perf || game.perf)
            },
            Env: env
        }
        if (err) return reply(err)
        fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${game.idDocker}/kill`, {
            method: 'POST'
        })
        .then(res => {
            if (res.status < 200 || res.status >= 300) {
                console.log(res.status)
                throw new Error(res.status)
            }
            res.json()
        })
        .then(() => {
            fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${game.idDocker}`, {
                method: 'DELETE'
            })
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    console.log(res.status)
                    throw new Error(res.status)
                }
                res.json()
            })
            .then(() => {
                fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        console.log(res.status)
                        throw new Error(res.status)
                    }
                    return res.json()
                })
                .then(json => {
                    newgame.idDocker = json.Id
                    fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${json.Id}/start`, {
                        method: 'POST'
                    })
                    .then(res => {
                        if (res.status < 200 || res.status >= 300) {
                            console.log(res.status)
                            throw new Error(res.status)
                        }
                    })
                    .then(() => {
                        fetch(`http://${DOCKER_IP}:${DOCKER_PORT}/v1.35/containers/${json.Id}/json`)
                        .then(res => {
                            if (res.status < 200 || res.status >= 300) {
                                console.log(res.status)
                                throw new Error(res.status)
                            }
                            return res.json()
                        })
                        .then(container => {
                            const ip = container.NetworkSettings.IPAddress
                            const port = parseInt(ip.split('.')[ip.split('.').length -1]) -1
                            newgame.url = `172.20.10.4:100${port}`
                            GameManager.findOneAndUpdate(req.params.id, newgame, (err, finalgame) => {
                                if (err) return reply(err)
                                reply(finalgame)
                            })
                        })
                        .catch(catchErr)
                    })
                    .catch(catchErr)
                })
                .catch(catchErr)
            })
            .catch(catchErr)
        })
        .catch(catchErr)
    })
}

exports.deleteGame = (req, reply) => {
    GameManager.remove(req.params.id, (err, game) => {
        if (err) return reply(err)
        reply({ message: 'Game successfully deleted' })
    })
}
