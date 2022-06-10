const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next ) =>{

    const errores = validationResult( req );

    console.log('errores', errores)
    
    if( !errores.isEmpty() ){
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        })
    }

    next();
}

module.exports = {
    validateFields
}