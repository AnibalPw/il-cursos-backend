const jwt = require('jsonwebtoken');


const generateActivationToken = ( uid ) =>{

    return new Promise( (resolve, reject)=>{

        const payload = { uid };

        jwt.sign( payload, process.env.SECRET_JWT_ACTIVATION_ACCOUNT, {
            expiresIn: '20min' //Para test 9000ms
        }, ( err, token ) =>{

            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}

const signToken = ( uid, name ) =>{

    return new Promise( (resolve, reject)=>{

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' //Para test 9000ms
        }, ( err, token ) =>{

            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}

const generateJWT = ( uid, name ) =>{

    return new Promise( (resolve, reject)=>{

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' //Para test 9000ms
        }, ( err, token ) =>{

            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}

//Generar token para restablecer contraseña va a tardar 20m 
const resetPasswordToken = ( uid, name ) =>{

    console.log(uid, name)
    return new Promise( (resolve, reject)=>{

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_RESET_PASSWORD, {
            expiresIn: '20m' //Para test 9000ms
        }, ( err, token ) =>{

            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}

module.exports={
    generateActivationToken,
    generateJWT,
    signToken,
    resetPasswordToken
}