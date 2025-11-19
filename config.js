const config = {
    appConfig: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT
    },
    dbConfig: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME
    },
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d'
    }
}

module.exports = config
