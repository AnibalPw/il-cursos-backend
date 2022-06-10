const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { type: String, required: true },
    isActive:{ type: Boolean, required: true },
    role:{
        type: String,
        enum: {
            values: ['user', 'instructor', 'administrator'],
            message: '{VALUE} no es un rol válido',
            default: 'user',
            required: true,
        }
    },
    activeAccountLink:{
        data: String,
        default: ''
    },
    resetLinkPassword:{
        data: String,
    }
},{
    timestamps: true,
})


module.exports = model('User', UserSchema);