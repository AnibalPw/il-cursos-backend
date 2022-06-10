const {Schema, model} = require('mongoose');


const SectionsSchema = new Schema({

    sectionTitle: {type: String, required: true},
    indexSection: {type: Number, required: true}, //-> Ej: 1
    indexName: {type: String, required: true}, //-> Ej: Sección 1
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videos:[{
        parentSectionId: { type: String, required: true },
        lessonName: { type: String, required: true },
        originalName: { type: String },
        destination: { type: String },
        filename: {type: String}, 
        path: {type: String}
    }]

},{timestamps: true});

module.exports = model('Sections', SectionsSchema);