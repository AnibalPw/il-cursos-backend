const Categories = require('../models/Category');

const createCategories = async () =>{

    try {
        const count = await Categories.estimatedDocumentCount();

        if(count > 0)return;
    
        const values = await Promise.all([
            new Categories({categoryName: 'Desarrollo'}).save(),
            new Categories({categoryName: 'Diseño'}).save(),
            // new Role({name: 'contentCreator'}).save(),
            // new Role({name: 'administrator'}).save(),
        ]);
    
        console.log('values')
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Error al generar role'
        })
    }

}

module.exports = {createCategories};