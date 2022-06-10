const Course = require('../models/Courses');
const Sections = require('../models/Sections');

/**
 * Sections and video course
 */

 const getCourseSections = async (req, res ) =>{
    const {uid, name} = req;
    const courseId = req.params.id;
    // const { cursoId } = req.body

    try {

        const sections = await Sections.find({ "courseId": courseId, "author": uid }).populate('author','name') // Si no le pasa el filtro le retorna todo
            // const notas = await Nota.find().populate('author','name')
            // console.log('secciones', secciones)
            res.status(200).json({
                ok: true,
                sections
            });

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const createCourseSections = async ( req, res ) =>{

    const { _id } = req.body;
    const courseId = _id
    // const { cursoId } = req.body;

    console.log('req.body-crear', req.body)
    try {
        
        const course = Curso.findById( courseId );

        if ( !course ) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }

        const section = new Sections( req.body.courseSection );
        // const section = new Sections( req.body.seccionCurso );

        section.sectionTitle = req.body.seccionCurso.sectionTitle;
        section.indexSection = req.body.seccionCurso.indexSection
        section.indexName = req.body.seccionCurso.indexName
        // seccion.tituloSeccion = req.body.tituloSeccion;
        // seccion.indiceSeccion = req.body.indiceSeccion
        // seccion.nombreInidice = req.body.nombreInidice
        section.cursoId = courseId;
        section.author = req.uid;
        const savedSection = await section.save(); 


        res.status(200).json({
            ok: true,
            section: savedSection,
            msg: 'Seccion guardada con éxito.'
        })
        
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}


const updateSection = async( req, res ) =>{

    const sectionId = req.params.id;
    const uid = req.uid;

    try {
        const section = await Sections.findById( sectionId );
            
        if ( !section ) {
            return res.status(404).json({
                ok: false,
                msg: 'Seccion no existe'
            });
        }

        // if ( seccion.cursoId.toString() !== uid ) {
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegios de editar esta sección'
        //     });
        // }

        const newSection = {
            ...req.body,
            cursoId: req.body.cursoId
        }

        const updatedSection = await Sections.findByIdAndUpdate( sectionId, newSection, { new: true } );

        res.json({
            ok: true,
            section: updatedSection
        });

    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }
}

const deleteSection = async (req, res) => {

    // console.log('notaId', req.params) 
    const sectionId = req.params.id;
    const uid = req.uid;
    
    try {

        const section = await Sections.findById( sectionId );

        if ( !section ) {
            return res.status(404).json({
                ok: false,
                msg: 'Sección no existe por ese id'
            });
        }

        // if ( nota.author.toString() !== uid ) {
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegio de eliminar esta nota'
        //     });
        // }


        await Sections.findByIdAndDelete( sectionId );

        res.status(200).json({ 
            ok: true, msg: 'La sección se ha eliminado con éxito.' 
        });

        
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor ponerse en contacto con el administrador'
        });
    }

}



/**
 * Content of the sections -> Classes
 */


/**
 * Content of the classes -> Videos
 */

module.exports={
    getCourseSections,
    createCourseSections,
    updateSection,
    deleteSection,
}