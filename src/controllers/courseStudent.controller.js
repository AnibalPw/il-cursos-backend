const Course = require('../models/Courses')
const EnrollCourse = require('../models/EnrollCourse')

//Controlador para la información relacionada con el estudiante, ver cursos, comentar cursos, lista de los cursos disponibles etc


/** 
 * Estudiantes -> Aquí se debe ver los cursos 
 * disponibles pero para visualizarlos tiene que estar logeado
 * **/
//Lista de cursos disponibles
const allCourseAvailable = async( req, res )=>{

    try {
        
        const populateQuery = [ 
            // {path:'author', select:'name -_id'}, 
            {path:'author', select:'name lastName'}, 
            // {path: 'idPerfilAuthor', select:['name', 'apellido', 'avatarUsuario']}, 
            {path:'category', select:'categoryName -_id'}, 
            {path:'subCategory', select:'subCategoryName -_id'}, 
        ];

        const selectQuery = [
            'titleCourse',
            'description',
            'learning._id',  
            'learning.learning',
            'prevKnowledge._id',
            'prevKnowledge.prevKnowledge',
            'targetStudents.targetStudent',
            'thumbnail.path',
            'qualification',
            'totalReviews',
            'updatedDate'
        ]

        const allCourse = await Course.find( { "published": true } ).populate( populateQuery ).select(selectQuery).sort( { updatedAt: 1 } )

        // console.log('cursosDisponibles', cursosDisponibles)

        res.status(200).json({
            ok: true,
            allCourse
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}


module.exports = {
    allCourseAvailable,
}