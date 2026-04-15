const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
   if(!req.body.name || !req.body.age || !req.body.height){
    return res.status(400).json({ error: 'Name, age and height are required!'});
   }

   const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
   };

   try{
        const newDomo = new Domo(domoData);

        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, height: newDomo.height});
   }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Domo already exists!'});
        }
        return res.status(500).json({ error: 'An error has occured making the domo!'});
   }
}

const changeDomo = async (req, res) => {
    if(!req.body.name){
        return res.status(400).json({ error: 'Name required!'});
   }

   if(!req.body.newAge && !req.body.newHeight){
        return res.status(400).json({ error: 'Age or height required!'});
   }

   //makes the new data
    const newData = {
    name: req.body.name,
    age: req.body.newAge,
    height: req.body.newHeight,
    owner: req.session.account._id,
   };

   const query = {owner: req.session.account._id};
   const oldDocs = await Domo.find(query).find( {name: newData.name}).select('name age height');
   
   //if the name doesn't exist returns an error
   if(newData.name !== oldDocs[0].name){
        return res.status(400).json({error: "Name doesn't exists"});
   }

   //if either age or height is null it puts in the old value
   if(!newData.age){
    newData.age = oldDocs[0].age;
   }

   if(!newData.height){
    newData.height = oldDocs[0].height;
   }

   try{
    await Domo.updateOne(
        {
            name: newData.name,
            owner: newData.owner,
        },
        {$set: {
            age: newData.age,
            height: newData.height,
        }}
    );

    return res.status(201).json({name: newData.name, age: newData.age, height: newData.height});
   }catch(err){
    console.log(err);
    return res.status(500).json({ error: 'An error has occured changing the domo!'});
   }
}

const getDomos = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name age height').lean().exec();

        return res.json({domos: docs}); 
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!'});
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    changeDomo
}