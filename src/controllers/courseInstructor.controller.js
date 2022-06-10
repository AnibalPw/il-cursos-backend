const Course = require('../models/Courses')
const EnrollCourse = require('../models/EnrollCourse');
const { addInformation } = require('../helpers/crudInfoCourse');

//Controlador para creación y configuración de cursos 

//Get all course for each instructor
const courseXinstructor = async( req, res )=>{
    const {uid, name} = req;

    try {
        
        const populateQuery = [ 
            {path:'author', select:'name lastName'},
            // {path: 'idPerfilAuthor', select:['name', 'apellido', 'avatarUsuario']}, 
            {path:'category', select:'categoryName'}, 
            {path:'subCategory', select:'subCategoryName'}, 
        ];

        // const cursosInstructor = await 
        Course.find( { "author": uid } ).populate( populateQuery )
        .exec(async (error, coursesInstructor) =>{
            if(error){
                res.status(500).json({
                    ok: false,
                    msg: 'Por favor ponerse en contacto con el administrador'
                })
            }else{
                if(!coursesInstructor){
                    return res.status(404).json({
                        ok: false,
                        msg: 'Este curso no existe o no tiene acceso a el.'
                    })
                }else{
                    
                    let courseId = coursesInstructor.map( cxi => cxi._id )
                   const sectionsXcourse = await Secciones.find( { "courseId": courseId, "author": uid } )

                //    console.log('cursosInstructor', cursosInstructor)
                   return res.status(200).json({
                       ok: true,
                       coursesInstructor,
                       sectionsXcourse
                   })
                }

            }
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}


const createCourse = async( req, res ) =>{

    console.log('req.body', req.body)
    const course = new Course( req.body );

    try {

        let date = new Date();

        const formatDate = (date)=>{
            let formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            return formatted_date;
        }
       

        course.author = req.uid;
        // course.idPerfilAuthor = req.uid;
        // curso.categoria = req.body.categoriaSeleccionada;
        course.category = req.body.category;
        course.thumbnail = ''
        course.description = ''
        course.updatedDate = formatDate(date)

        const savedCourse = await course.save(); 

        res.status(200).json({
            ok: true,
            course: savedCourse,
            msg: 'Curso guardada con éxito.'
        })

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

//getSeccionesCurso...




//Seleccionar curso que voy a editar
const getCourseToEdit = async( req, res )=>{

    const courseId = req.params.id;
    const { uid, name } = req;

    try {

        const course = await Course.findById( courseId );
            
        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Ocurrió un error al intentar mostrar el curso.'
            });
        }


        Course.findOne( { "_id": courseId, "author": uid } )
        .exec(async (error, courseToEdit) =>{
            if(error){
                return res.status(500).json({
                    ok: false,
                    msg: 'Por favor ponerse en contacto con el administrador'
                })
            }else{
                if(!courseToEdit){
                    return res.status(404).json({
                        ok: false,
                        msg: 'Ocurrió un error al intentar mostrar el curso.'
                    })
                }else{
                    // const seccionesXcursos = await Secciones.find( { "cursoId": cursoId } ).populate( populateQuerySeccion )
                    // const seccionesXcursos = await Secciones.find( { "cursoId": cursoId } )

                    return res.status(200).json({
                        ok: true,
                        course: courseToEdit,
                        msg: 'El curso se encuentra en borrador en este momento, nadie podrá visualizar el curso hasta que sea publicado nuevamente.'
                    })
                }

            }
        })
        
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}


//Actualizar datos adicionales del curso - "Actualizar curso"
const additionalCourseDetails = async( req, res ) =>{

    const courseId = req.params.id;
    const uid = req.uid;

    const {files} = req;


    try {
        const course = await Course.findById( courseId );
            
        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        
        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        let date = new Date();
        const formatDate = (date)=>{
            let formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            return formatted_date;
        }
       
        let vid_course = files?.vid_cursos !== undefined ? files?.vid_cursos[0] : false;

        let newCourse

        if( vid_course === false)
        {
            newCourse = {
                _id: courseId,
                titleCourse: req.body.titleCourse,
                description: req.body.description,
                category: req.body.category,
                subCategory: req.body.subCategory,
                isPrivate: req.body.isPrivate, //false
                updateDate: formatDate(fecha),
                language: req.body.language,
                courseLevel: req.body.courseLevel
            }
        }else{
            
            newCourse = {
                _id: courseId,
                titleCourse: req.body.titleCourse,
                description: req.body.description,
                category: req.body.category,
                subCategory: req.body.subCategory,
                thumbnail: { 
                    originalName: vid_cursos?.originalname,
                    destination: vid_cursos?.destination,
                    filename: vid_cursos?.filename,
                    path: vid_cursos?.path,
                    size:  vid_cursos?.size,
                },
                isPrivate: req.body.isPrivate, //false
                updateDate: formatDate(fecha),
                language: req.body.language,
                courseLevel: req.body.courseLevel
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate( courseId, newCourse, { new: true } );

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

//Quitar el curso de los publicados para editarlo
const isPrivateFalse = async( req, res )=>{

    const courseId = req.params.id;
    const uid = req.uid;


    try {
        const course = await Course.findById( courseId );
            
        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        
        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        const updatedCourse = await Curso.findByIdAndUpdate( courseId, 
            {$set:{isPrivate: req.body.isPrivate}}, 
            { new: true } 
        );

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const publishCourse = async( req, res )=>{

    const courseId = req.params.id;
    const uid = req.uid;

    try {

    const course = await Course.findById( courseId );
    const registrationPublic = await EnrollCourse.findOne( { "courseId": courseId, "author": uid } );
    
    // const commentPublic = await ComentarioCurso.findOne( { "courseId": courseId, "author": uid } );

    if ( !course ) {
        return res.status(404).json({
            ok: false,
            msg: 'Curso no existe'
        });
    }

    if ( course.author.toString() !== uid ) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios de editar este curso'
        });
    }

    const publishCourse = {
    // const newCourse = {
        courseId: req.body.courseId,
        isPrivate: req.body.isPrivate, //true - false( cuando vaya a editar el curso )
        numberPublications: course.numberPublications + 1
    }

    const updatedCourse = await Course.findByIdAndUpdate( courseId, publishCourse, { new: true } );


    if( !updatedCourse.isPrivate ){ //false

        return res.status(200).json({
            ok: true,
            course: updatedCourse,
            msg: 'Curso en edición.'
        });

    }else if( !registrationPublic ){

        console.log(`req.body`, req.body)
        const registrationXcourse = new EnrollCourse( req.body );
        // const commentsXcurso = new ComentarioCurso( req.body )

        registrationXcourse.courseId = courseId;
        registrationXcourse.author = req.uid;
        registrationXcourse.registeredUsers = req.body.registeredUsers;

        
        const enrollCourse = await registrationXcourse.save(); 
        
        // comentariosXcurso.cursoId = cursoId;
        // comentariosXcurso.author = req.uid;
        // comentariosXcurso.comentariosUsuarios = req.body.comentariosUsuarios;

        // const comentariosCurso = await comentariosXcurso.save(); 

        return res.status(200).json({
            ok: true,
            enroll: enrollCourse,
            // comments: courseComments,
            course: updatedCourse,
            msg: 'Ahora es posible matrícular este curso.'
        });

    }else{
        console.log(`hola2`)
        return res.status(200).json({
            ok: true,
            registration: registrationPublic,
            // comentarios: comentariosPublicos, // comentariosXcurso 
            course: updatedCourse,
            msg: 'Ahora es posible matrícular este curso 2.'
        });
        
    }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const deleteCourse = async (req, res)=>{

    
    const courseId = req.body._id;
    const uid = req.uid;

    try {
        
            const courseExists = await Course.findById( courseId );
          

            if ( !courseExists ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El curso no existe'
                });
            }

            if ( courseExists.author.toString() !== uid ) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de eliminar este curso'
                });
            }


            await Course.findByIdAndDelete( courseId );
            // await MatriculaCurso.findOneAndDelete({ 'courseId': courseId })
            // await ComentarioCurso.findOneAndDelete({ 'courseId': courseId })

            // await Sections.find({ 'courseId': courseId }).exec(async (error, deleteSections) =>{
            //     console.log('seccionesEliminar', seccionesEliminar)
            //     if( deleteSections !== []){

            //         cursosMatriculado = await Promise.all(
            //             deleteSections.map( async deleteSection =>

            //                 await Sections.findOneAndDelete( { courseId: deleteSection.courseId } )
            //             )
            //         )

            //     }

            // })

            res.status(200).json(
                { ok: true, msg: 'El curso se ha eliminado con éxito.' }
            );

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}


/**
 * Insertar/Actualizar campos de una 
 */

const addTargetStudents = async(req, res)=>{

    let body = req.body;
    const uid = req.uid;

    try{

        const course = await Course.findById( body._id );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        //Testear
        // let updatedCourse = await addInformation( body._id, Course, targetStudents )

        let targetStudents = { 'targetStudents':  {targetStudent: ''} }

        Course.find().addInformation(body._id, targetStudents ).exec( async (err, data) =>{
            if (err) return console.log('err', err)

            let updatedCourse = await Course.findById(body._id)
            return res.status(200).json({
                ok: true,
                course: updatedCourse
            });
        })

      


        // res.status(200).json({
        //     ok: true,
        //     course: updatedCourse
        // });
   
        // updatedCourse = await Course.findByIdAndUpdate({_id: body._id}, {
        //     $push: {
        //         'targetStudents': {
        //             targetStudent: ''
        //         }
        //     }
        // }, {new: true})

        // return res.status(200).json({
        //     ok: true,
        //     course: updatedCourse
        // });

    }
    catch(error){
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

const editTargetStudent = async(req, res)=>{

    let body = req.body;
    const courseId = req.params.id;
    const uid = req.uid;

    try {
        
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        let data = body
        let updatedCourse 
      
      
        if(data !== []){

            await data.map( d => {
    
                course.targetStudents.forEach( async cEsO => {
    
                    if(String(cEsO._id) === String(d._id)){
    
                        await Course.updateMany(
                        {"_id": courseId, "targetStudents._id": String(cEsO._id)},
                        {"$set": {
                            'targetStudents.$': {
                                _id: cEsO._id,
                                targetStudent: d.targetStudent,
                            }
                        }}, {new: true})
                    }
    
                });
            })
        }
        // 'targetStudents.$._id':d._id,
        // 'targetStudents.$.targetStudent': d.targetStudent
        // 'targetStudents.$[targetStudent]._id': {
        //     _id: d._id,
        //     targetStudent: d.targetStudent
        // }
        updatedCourse = course

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });


    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const deleteTargetStudent = async(req, res) =>{

    const body = req.body
    const courseId = req.params.id;
    const uid = req.uid;


    try {
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este curso'
            });
        }

        let data = body;

        if( data !== []){

            Course.findOneAndUpdate({ '_id': courseId, "targetStudents._id": data[0]._id },

                {'$pull':{
                    'targetStudents': {
                        _id: data[0]._id,
                    }
                }}, {new: true},
                function(err, doc){
            
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            msg: 'No tiene privilegios para editar este curso'
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        course: doc
                    });
    
                }
            )
             
        }

      

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const addLearning = async(req, res) =>{

    let body = req.body;
    // const cursoId = req.params.id;
    const uid = req.uid;

    let error

    try {
        const course = await Course.findById( body._id );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        
        let updatedCourse = await Course.findByIdAndUpdate({_id: body._id}, {
                $push: {
                    'learning': {
                        learning: ''
                    }
                }
            }, {new: true})
    

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

const editLearning = async(req, res) =>{

    let body = req.body;
    const courseId = req.params.id;
    const uid = req.uid;

    try {
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        let data = body.learning
        let updatedCourse 

        // console.log('data', data, body)

        if(data !== []){

            updatedCourse = await data.map( d => {
    
                course.learning.forEach( async learn => {

                if(String(learn._id) === String(d._id)){

                    await Course.updateMany(
                    {"_id": courseId, "learning._id": String(learn._id)},
                    {"$set": {
                            'learning.$': {
                                _id: learn._id,
                                learning: d.learning
                            }
                        }
                    }, {new: true})
                }
    
                });
            })
    
            
        }
        updatedCourse = course

        // console.log('cursoActualizado', cursoActualizado)

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

const deleteLearning = async(req, res) =>{

    const body = req.body
    const courseId = req.params.id;
    const uid = req.uid;


    try {
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }
        let data = body;

        if( data !== []){

            Course.findOneAndUpdate({ '_id': courseId, "learning._id": data[0]._id },

                {'$pull':{
                    'learning': {
                        _id: data[0]._id,
                    }
                }}, {new: true},
                function(err, doc){
            
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            msg: 'No tiene privilegios para editar este curso'
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        course: doc
                    });
    
                }
            )
             
        }


    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}


const addPrevKnowledge = async(req, res) =>{

    let body = req.body;
    // const cursoId = req.params.id;
    const uid = req.uid;

    try {
        const course = await Course.findById( body._id );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        
        let updatedCourse = await Course.findByIdAndUpdate({_id: body._id}, {
            $push: {
                'prevKnowledge': {
                    prevKnowledge: ''
                }
            }
        }, {new: true})

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}


const editPrevKnowledge = async(req, res) =>{

    let body = req.body;
    const courseId = req.params.id;
    const uid = req.uid;

    try {
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        let data = body.prevKnowledge
        let updatedCourse 


        // if(data !== []){
        //     updatedCourse = await Course.findByIdAndUpdate(courseId, await data.map( d => {
    
        //         course.prevKnowledge.forEach( async cpk => {
    
        //             if(String(cpk._id) === String(d._id)){
    
        //                 await Course.updateMany(
        //                 {"_id": courseId, "prevKnowledge._id": String(cpk._id)},
        //                 {"$set": {
        //                         'prevKnowledge.$': {
        //                             _id: cpk._id,
        //                             prevKnowledge: d.prevKnowledge
        //                         }
        //                     }
        //                 }, {new: true})
        //             }
    
        //         });
        //     }), {new: true})
        // }
        if(data !== []){

            await data.map( d => {
    
                course.prevKnowledge.forEach( async cEsO => {
    
                    if(String(cEsO._id) === String(d._id)){
    
                        await Course.updateMany(
                        {"_id": courseId, "prevKnowledge._id": String(cEsO._id)},
                        {"$set": {
                            'prevKnowledge.$': {
                                _id: cEsO._id,
                                prevKnowledge: d.prevKnowledge,
                            }
                        }}, {new: true})
                    }
    
                });
            })
        }
        updatedCourse = course

        res.status(200).json({
            ok: true,
            course: updatedCourse
        });

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

const deletePrevKnowledge = async(req, res) =>{

    const body = req.body
    const courseId = req.params.id;
    const uid = req.uid;


    try {
        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }
        let data = body;

        if( data !== []){

            Course.findOneAndUpdate({ '_id': courseId, "prevKnowledge._id": data[0]._id },

                {'$pull':{
                    'prevKnowledge': {
                        _id: data[0]._id,
                    }
                }}, {new: true},
                function(err, doc){
            
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            msg: 'No tiene privilegios para editar este curso'
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        course: doc
                    });
    
                }
            )
             
        }

    //     const updatedCourse = await Curso.findByIdAndUpdate( courseId, await data.map( d => {
    //         course.prevKnowledge.forEach( async cpk => {

    //             if(String(cpk._id) === String(d._id)){
    //                 // updateMany
    //                 await Course.findByIdAndUpdate(
    //                 {"_id": courseId, "prevKnowledge._id": String(cpk._id)},
    //                 {"$pull": {
    //                         'prevKnowledge': {
    //                             _id: cpk._id,
    //                         }
    //                     }
    //                 })

    //             }
    //         });
    //     }), { new: true } );



    // res.status(200).json({
    //     ok: true,
    //     course: updatedCourse
    // });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

/**
 * Add and update information
 */

const addUpdateInformation = async(req, res) =>{

    let body = req.body;
    const courseId = req.params.id;
    const uid = req.uid;

    try {

        const course = await Course.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        if ( course.author.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este curso'
            });
        }

        let data = body.information
        let updatedCourse 

       
        if(data !== []){
            
            let query = {}
            let array
            let filterQuery

            await data[0].map( async d => {


                if( d._id === undefined ){

                    
                    query = { 'targetStudents':  { targetStudent: d.targetStudent } }

                    Course.find().addInformation( courseId, query ).exec( async (err, dataInfo) =>{

                        if (err) return console.log('err', err)
            
                        console.log('dataInfo', dataInfo)
                    })

                }else{

                    
                    filterQuery = { "_id": courseId, 'targetStudents._id': String(d._id) }
                    array = course.targetStudents
                    query = { 'targetStudents.$': { _id: d._id, targetStudent: d.targetStudent } }                 
            

                    array.forEach( async info =>{

                        if( String(info._id) === String(d._id) ){

                            await Course.updateMany(
                            filterQuery,
                            { "$set": query }, { new: true })
                        }

                    })
                }

            })
            await data[1].map( async d => {

                if( d._id === undefined ){


                    query = { 'learning':  { learning: d.learning } }
  
                    Course.find().addInformation( courseId, query ).exec( async (err, dataInfo) =>{
                        if (err) return console.log('err', err)
                    })

                }else{

             
                    filterQuery = { "_id": courseId, 'learning._id': String(d._id) }
                    array = course.learning
                    query = { 'learning.$': { _id: d._id, learning: d.learning } }                 
                

                    array.forEach( async test =>{

                        if( String(test._id) === String(d._id) ){

                            await Course.updateMany(
                            filterQuery,
                            { "$set": query }, { })
                        }

                    })
    
                }

            })
            await data[2].map( async d => {


                if( d._id === undefined ){

                    query = { 'prevKnowledge':  { prevKnowledge: d.prevKnowledge } }
    
                    Course.find().addInformation( courseId, query ).exec( async (err, dataInfo) =>{
                        if (err) return console.log('err', err)
            
                    })

                }else{

                    filterQuery = { "_id": courseId, 'prevKnowledge._id': String(d._id) },
                    array = course.prevKnowledge
                    query = { 'prevKnowledge.$': { _id: d._id, prevKnowledge: d.prevKnowledge } }


                    array.forEach( async test =>{

                        if( String(test._id) === String(d._id) ){

                            await Course.updateMany(
                            filterQuery,
                            { "$set": query }, { })
                        }

                    })
    
                }

            })
        }

        updatedCourse = await Course.findById(courseId)

        return res.status(200).json({
            ok: true,
            course: updatedCourse
        });
  
        
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}

module.exports = {
    createCourse,
    courseXinstructor,
    // allCourse,
    getCourseToEdit,
    additionalCourseDetails,
    isPrivateFalse,
    publishCourse,
    deleteCourse,

    //EstudiantesObjetivo
    addTargetStudents,
    editTargetStudent,
    deleteTargetStudent,

    //Aprendizaje
    addLearning,
    editLearning,
    deleteLearning,

    //PrevKnowledge
    addPrevKnowledge,
    editPrevKnowledge,
    deletePrevKnowledge,

    //Test
    addUpdateInformation
}