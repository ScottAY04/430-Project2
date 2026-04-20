const { RedisStore } = require('connect-redis');
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
        return res.status(500).json({ error: 'Error retrieving gunplas!'});
    }
}

const getGunplaByFilter = async (req, res) => {
    try{
        //sets the url for me to filter our the query 
        const protocol = req.connection.encrypted ? 'https' : 'http';
        const parsedUrl = new URL(req.url, `${protocol}://${req.headers.host}`);
        const filter = parsedUrl.searchParams.get('grade');

        //searches up the data with the query
        const query = {owner: req.session.account._id};
        const docs = await Gunpla.find(query).find({grade: filter}).select('name grade price').lean().exec();

        return res.json({gunplas: docs}, {redirect: '/maker'}); 
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving gunplas!'});
    }
}

const gunplaBuilt = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        console.log(req.body.built);
        console.log(req.body.name);

        await Gunpla.updateOne(
            {
                owner: req.session.account._id,
                name: req.body.name,
                grade: req.body.grade
            },
            {$set: {
                built: req.body.built
            }}
        );
        return res.status(201).json({Message: 'Finished building this one'}, {redirect: '/maker'});
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving gunplas!'});
    }
}

module.exports = {
    makerPage,
    makeGunpla,
    getGunpla,
    getGunplaByFilter,
    gunplaBuilt,
}