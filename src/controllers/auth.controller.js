const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const { generateJWT, generateActivationToken, signToken } = require('../helpers/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const registerUser = async( req, res = response ) => {
    console.log('req.body', req.body)
    const { name, lastName, email, password } = req.body

    try {

        let user = await User.findOne({ email })

        if(user){
            return res.status(400).json({
                ok: false,
                msg:'El correo presenta un error o se encuentra en uso.',
            })
        }

        const newUser = new User({ 
            name,
            lastName,
            email: email.toLowerCase(),
            password: bcrypt.hashSync( password, 10 ), //da 10 vueltas por defecto
            role: 'user',
            isActive: true, //De momento luego hacer las validaciones necesarias
        })

        await newUser.save({ validateBeforeSave: true })

        const { _id, role } = newUser;

        const token = signToken( _id, email )
    
        return  res.status(200).json({
            token: token, //jwt retorna un string
            user:{
                email,
                name,
                lastName,
                role
            }
        })

        // user = new User( req.body );

        //  //Encrypt password
        //  const salt = bcrypt.genSaltSync();
        //  user.password = bcrypt.hashSync( password, salt );

        //  user.isActive = true //false;

        //  const activationToken = await generateActivationToken( user.id );

        // const emailSent = await activation_mail(email, tokenActivacion);
        // await user.save();
 

    } catch (error) {
        console.log('error', error)
        return res.status(401).json({
            ok:false,
            msg: "Por favor ponerse en contacto con el administrador."
        })
    }
}

//Login
const loginUser = async (req, res = response) =>{

    const { email, password } = req.body;

    //Manejo de errores

    try {

        let user = await User.findOne({ email });

        // const perfil = await PerfilUsuario.find({ idUsuario: usuario._id })

        // if ( !perfil ) {
        //     return res.status(404).json({
        //         ok: false,
        //         msg: 'Perfil no existe'
        //     });
        // }

        if( !user ){
            return res.status(400).json({
                ok: false,
                msg:'Usuario o contraseña son incorrectos.',
            });
        }

        if(!user.isActive){
            return res.status(400).json({
                ok: false,
                msg: 'Lo sentimos la cuenta no se encuentra activa.'
            })
        }

        user = await (await User.findOne({ email }));
        // user = await (await User.findOne({ email })).populate('roles');

        //Confirmar password
        // const validPassword = await usuario.isValidPassword( password )

        if( !bcrypt.compareSync( password, user.password ) ) {
            return  res.status(400).json({  ok: false, msg:'Usuario o contraseña son incorrectos.' })
        }
        const { _id, name, lastName, role  } = user;

        //Generar JWT
        const token = await generateJWT( _id, name );

        res.status(200).json({
            ok: true,
            uid: _id,
            name,
            lastName,
            role,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Por favor ponerse en contacto con el administrador'
        })
    }

};


//Login with Google
const googleOAuth = async(req, res)=>{

    const { data } = req.body

    try {
        
        client.verifyIdToken( {idToken: data, audience: process.env.GOOGLE_CLIENT_ID})
        .then( response => {
            const { email_verified, name, family_name, email, picture } = response.payload;

            if(email_verified){

                User.findOne({ email }).exec( async(err, user) =>{
                    if( user ){
                        const token = await signToken( _id, name );

                        return res.status(200).json({
                            ok: true,
                            uid: user._id,
                            name: user.name,
                            lastName: user.lastName,
                            role: user.role,
                            token
                        })

                    }else{

                        const newUser = new User({ email, name, lastName: family_name, password: '@', role: 'user' });

                        await newUser.save( async (err, data) =>{
                            if (err) {
                                console.log( err );
                                return res.status(400).json({
                                ok: false,
                                msg: 'Error al registrarse con Google'
                                });
                            }
                            const token = await generarJWT( user._id, user.name );
                            return res.status(200).json({
                                ok: true,
                                uid: user.id,
                                name: user.name,
                                apellido: user.apellido,
                                roles: user.roles,
                                token
                            })
                        });

                    }
                })
            }
            else{
                return res.status(400).json({
                    ok: false,
                    msg: 'Registro con google falló. Intente de nuevo'
                });
            }

        })

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        })
    }

}

const revalidateToken = async (req, res = response) =>{

    try {
        // const uid = req.uid;
        // const name = req.name;
        const { uid, name } = req;
        
        //Generar JWT
        const token = await signToken( uid, name );

        res.json({
            ok: true,
            uid, 
            name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg:'Por favor ponerse en contacto con el administrador'
        });
    }

};

module.exports = {
    registerUser,
    loginUser,
    googleOAuth,
    revalidateToken
}