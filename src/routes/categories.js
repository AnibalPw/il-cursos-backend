/*
    Courses Routes
    /api/categories
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getCategories } = require('../controllers/category.controller');

const { validateJWT } = require('../middlewares/vallidate-jwt');

const router = Router();


router.use( validateJWT );

// Get all categories users
router.get('/', getCategories);

// Get all categories admin's
// router.get('/',  [ isAdministrator ], getCategoriasData);

module.exports = router;