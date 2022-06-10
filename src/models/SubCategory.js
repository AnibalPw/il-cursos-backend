const { Schema, model } = require('mongoose')

const SubCategorySchema = new Schema({
    subCategoryName:{
        type: String,
        required: true,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
},
{
    timestamps: true //Con timestamp mongo se va a encargar de agregar la fecha de creación y de actualización
});

module.exports = model('SubCategory', SubCategorySchema);
