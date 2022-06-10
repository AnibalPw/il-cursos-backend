require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const { dbConnection } = require('./database/configdb');
const { configDB } = require('./config');
const { createCategories } = require('./helpers/initSetup');


// Crear el servidor de express
const app = express()

// Base de datos
dbConnection(configDB);
createCategories()

// CORS
app.use( cors() );


// Directorio Público
app.use( express.static('public') )

// Lectura y parseo del body
app.use( express.json() );
app.use(morgan('dev'));


// API End Points
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/categories', require('./routes/categories') );
app.use( '/api/course', require('./routes/courses') );//Estudiantes -> Aquí se debe ver los cursos disponibles pero para visualizarlos tiene que estar logeado
app.use( '/api/course/instructor', require('./routes/coursesInstructor') );//Instructores
app.use( '/api/sections', require( './routes/courseSections' ) )

// Escuchar peticiones
app.listen( process.env.APP_PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.APP_PORT }`);
});
