const {Schema, model} = require('mongoose');


const CourseSchema = new Schema({

    courseTitle:{ type: String, required: true},
    description:{ type: String },
    thumbnail:{
        originalName: { type: String },
        destination: { type: String },
        filename: {type: String}, 
        path: {type: String},
        size: {type: String}
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // idProfileAuthor: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'PerfilUsuario',
    //     required: true
    // },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory:{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
    targetStudents:[{
        targetStudent: { type: String, required: true}
    }],
    
    learning:[{
        learning: { type: String, required: true }
    }],

    prevKnowledge:[{
        prevKnowledge: {type: String, required: true}
    }],

    language:{ 
        type: String, 
        values: ['Inglés', 'Español'],
        default: 'Español' 
    },
    courseLevel: { 
        type: String, 
        enum: {
            values: ['Principiante', 'Intermedio', 'Avanzado'],
            message: '{VALUE} no es un nivel válido'
        },
        default: 'Principiante'
        // values: ['Principiante', 'Intermedio', 'Avanzado'],
    },

    qualification:{ type:Number, default: 0 },
    totalReviews:{ type:Number, default: 0 },
    
    isPrivate:{ type: Boolean, default: true },
    numberPublications:{ type:Number, default: 0},
    updateDate: { type: String }

},
{
    timestamps: true
});

CourseSchema.query.addInformation = function( id, query ){
  
    let pushQuery = {} ;

    pushQuery = query

    return this.updateMany({ _id: id },
        {$push: 
            pushQuery 
        },{new: true, upsert: true }    
    )
}

module.exports = model('Course', CourseSchema);