/*
    Courses Routes
    /api/courses
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { allCourseAvailable } = require('../controllers/courseStudent.controller');
// const {validarCampos} = require('../middlewares/validar-campos');


// const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/vallidate-jwt');
// const { isContentCreator, isAdministrator } = require('../middlewares/validar-roles');

const router = Router();

router.use( validateJWT );

router.get('/', allCourseAvailable)


module.exports = router;