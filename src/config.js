
const config ={
    appConfig:{
        host: process.env.APP_HOST,
        port: process.env.APP_PORT
    },
    configDB:{
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME
    }
}

module.exports = config