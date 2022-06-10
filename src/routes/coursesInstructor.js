/*
    Courses Routes
    /api/courses/instructor
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { 
    courseXinstructor, 
    createCourse, 
    additionalCourseDetails, 
    publishCourse, 
    isPrivateFalse, 
    deleteCourse, 
    addTargetStudents, 
    editTargetStudent, 
    deleteTargetStudent, 
    addLearning, 
    editLearning, 
    deleteLearning, 
    addPrevKnowledge, 
    editPrevKnowledge, 
    deletePrevKnowledge, 
    addUpdateInformation} = require('../controllers/courseInstructor.controller');
// const {validarCampos} = require('../middlewares/validar-campos');


// const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/vallidate-jwt');
// const { isContentCreator, isAdministrator } = require('../middlewares/validar-roles');

const router = Router();

router.use( validateJWT );

router.get(
    'instructor',
    // '/cursos-instructor', 
    // isContentCreator, 
    courseXinstructor
)

router.post(
    '/new-course', 
    [
        // isContentCreator,
        check('courseTitle','El titulo del curso es obligatorio').not().isEmpty(),
        // check('category','La categoria del curso es obligatoria').not().isEmpty(),
        // validarCampos,
        // validarCarpetaUsuarioExiste,
        // validarCarpetaCursoExiste,
    ],
    // [ isContentCreator ],
    createCourse,
);


router.put(
    '/new-course/:id',
    // removerThumbnail,
    // upuploadThumload.fields([{name: 'vid_cursos'}]), //thumbnail
    // actualizarCurso
    additionalCourseDetails
);

router.put(
    '/publish-course/:id',
    publishCourse
)
//Intentar quitar este endpoint y sólo dejar publishCourse para dejarlo en false o true
router.put(
    '/isPrivate-false/:id',
    isPrivateFalse
)

router.delete('/delete-course', deleteCourse );

/**
 * Endpoints target student -> target group
 */

 router.post(
    '/add-target-student', 
    // [ isContentCreator ],
    addTargetStudents,
);

router.put(
    '/edit-target-student/:id', 
    // [ isContentCreator ],
    editTargetStudent,
);
router.put(
    '/delete-target-student/:id', 
    // [ isContentCreator ],
    deleteTargetStudent,
);

/**
 * Endpoints learning to obtain
 */

 router.post(
    '/add-learning', 
    // [ isContentCreator ],
    addLearning,
);

router.put(
    '/edit-learning/:id', 
    // [ isContentCreator ],
    editLearning,
);

router.put(
    '/delete-learning/:id', 
    // [ isContentCreator ],
    deleteLearning,
);

/**
 * Endpoints previous knowledge
 */

 router.post(
    '/add-prev-knowledge', 
    // [ isContentCreator ],
    addPrevKnowledge,
);

router.put(
    '/edit-prev-knowledge/:id', 
    // [ isContentCreator ],
    editPrevKnowledge,
);

router.put(
    '/delete-prev-knowledge/:id', 
    // [ isContentCreator ],
    deletePrevKnowledge
);
    
router.put(
    '/manage-information/:id', 
    // [ isContentCreator ],
    addUpdateInformation,
);

module.exports = router;