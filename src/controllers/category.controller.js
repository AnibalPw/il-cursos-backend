const Categories = require('../models/Category');

const getCategories = async (req, res) => {

    try {
        
        // const usuario = await Usuario.find({ "_id": uid })

        const categories = await Categories.find()


        res.status(200).json({
            ok: true,
            categories,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Por favor ponerse en contacto con el administrador'
        });
    }

}

module.exports = {
    getCategories
}