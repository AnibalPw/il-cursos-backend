const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
    categoryName:{
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{
    timestamps: true 
});


module.exports = model('Categor', CategorySchema);