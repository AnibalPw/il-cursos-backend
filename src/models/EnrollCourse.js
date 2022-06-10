const {Schema, model} = require('mongoose');


const EnrollCourseSchema = new Schema({

    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // Instructor curso
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registeredUsers:[{
        registeredUsers:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        // idPerfilUsuarioMatriculado:{
        //     type: Schema.Types.ObjectId,
        //     ref: 'PerfilUsuario',
        // },
        qualificationToTheCourse:{
            type:Number, default: 0 
        }
    }]

},{timestamps: true});

module.exports = model('EnrollCourse', EnrollCourseSchema);