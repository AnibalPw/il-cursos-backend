const mongoose = require('mongoose');

const dbConnection = async({ host, port, dbName }) =>{
    try {

        const URI = process.env.DB_CNN
        ? process.env.DB_CNN
        : `mongodb://${host}:${port}/${dbName}` 

        console.log('URI', URI)
        await mongoose.connect( URI , 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('DB online')

    } catch (error) {
        console.log(error)
        throw new Error('Error al inicializar BD')
    }
}

module.exports = {
    dbConnection
}