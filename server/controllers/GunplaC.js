const models = require('../models');
const Gunpla = models.Gunpla;

const makerPage = (req, res) => {
    return res.render('app');
}

const makeGunpla = async (req, res) => {
   if(!req.body.name || !req.body.grade || !req.body.price){
    return res.status(400).json({ error: 'All fields are required!'});
   }

   const gunplaData = {
    name: req.body.name,
    grade: req.body.grade,
    price: req.body.price,
    built: false,
    owner: req.session.account._id,
   };

   try{
        const newGunpla = new Gunpla(gunplaData);

        await newGunpla.save();
        return res.status(201).json({ name: newGunpla.name, grade: newGunpla.grade, price: newGunpla.price});
   }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'gunpla already exists!'});
        }
        return res.status(500).json({ error: 'An error has occured making the gunpla!'});
   }
}

const getGunpla = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Gunpla.find(query).select('name grade price').lean().exec();

        return res.json({gunplas: docs}); 
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!'});
    }
}

const gunplaBuilt = async (req, res) => {
    
}

module.exports = {
    makerPage,
    makeGunpla,
    getGunpla,
}