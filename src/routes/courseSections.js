/*
    Secciones de los cursos Routes
    /api/sections
*/
const { Router } = require('express');
const { getCourseSections, createCourseSections, updateSection, deleteSection } = require('../controllers/courseSection.controller');
const { validateJWT } = require('../middlewares/vallidate-jwt');


// const router = require('./cursos');
const router = Router();

router.use( validateJWT );

router.get(
    '/new-course/content/:id',
    getCourseSections
)

router.post(
    '/new-course/content', 
    // [
    //     validarCarpetaUsuarioExiste,
    //     isContentCreator,
    //     validarCarpetaSeccionExiste,
    // ],
    createCourseSections
); // Valorar si crear la carpeta al momento de crear la sección


router.put(
    '/new-course/content/:id', 
    // [
    //     isContentCreator,
    //     renombrarCarpeta
    // // upload.single('vid-cursos')
    // ],
    updateSection
);

router.delete(
    '/nuevo-curso/contenido/:id', 
    // [
    //     isContentCreator,
    //     removerArchivosDirectorio,
    //     eliminarCarpeta
    // ],
    deleteSection
);


/**
 * Section content -> Classes/Videos
 */

 module.exports = router;
