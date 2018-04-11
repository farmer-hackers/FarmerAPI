require('dotenv').config()
const path = process.env.BASE_PATH

module.exports = {
    extern: {

    },

    intern: {
        login: `${path}login`,
        user: `${path}user`,
        getUser: `${path}user/{id}`,
        game: `${path}game`,
        getGame: `${path}game/{id}`,
        getUserGame: `${path}game/user/{id}`
    }
}
