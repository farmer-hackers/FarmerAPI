import GameRoutes from './GameRoutes'
import UserRoutes from './UserRoutes'

module.exports = (server) => {
    GameRoutes(server)
    UserRoutes(server)
}
