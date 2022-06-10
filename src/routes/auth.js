const { Router } = require('express'); //usa la que tiene en memoria. 
const { check } = require('express-validator')
// const {validarCampos} = require('../middlewares/validar-campos');
const router = Router();

const {
    registerUser,
    loginUser,
    googleOAuth,
    revalidateToken
} = require('../controllers/auth.controller');

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/vallidate-jwt');


router.post(
    '/signup', 
    [//middlewares
        check('name', 'El nombre es requerido').not().isEmpty(),
        check('email', 'El email es inválido').isEmail(),
        check('password', 'La contraseña es requerida y debe de ser mínimo de 8 caracteres').isLength({min: 8}).not().isEmpty(),
        validateFields
    ],
    registerUser);


router.post(
    '/signin', 
    [//middlewares
        check('email', 'El email es inválido').isEmail(),
        check('password', 'La contraseña es requerida y debe de ser mínimo de 8 caracteres').isLength({min: 8}).not().isEmpty(),
        // validarCampos,
    ],
    // validarCarpetaUsuarioExiste,
    loginUser);

    
router.post('/googleOAuth', googleOAuth );

router.get('/renew', validateJWT, revalidateToken);


module.exports = router;