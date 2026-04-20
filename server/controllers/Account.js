const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

const login = (req,res)=> {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({ error: 'All fields are required!'});
    }


    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account){
            return res.status(401).json({ error: 'Wrong username or password!'});
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/maker'});
    })
}

const signup = async (req,res)=> {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if(!username || !pass || !pass2){
        return res.status(400).json({ error: 'All fields are required!'});
    }

    if(pass !== pass2){
        return res.status(400).json({ error: 'Passwords do not match!'});
    }

    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
    }catch (err) {
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Username already in use!'});
        }
        return res.status(500).json({ error: 'An error occured!' });
    }
}

const changePassword = async (req, res) => {
    //grabs the requests body params
    const username = req.body.username;
    const pass = req.body.pass;
    const pass2 = req.body.pass2;

    //returns a bad request if any fields are missing
    if(!username || !pass || !pass2){
        return res.status(400).json({ error: 'All fields are required!'});
    }

    //if the passwords are not matching it will say the passwords don't match
    if(pass !== pass2){
        return res.status(400).json({ error: 'Passwords do not match!'});
    }

    //tries to change the password if it doesn't work it throws an error
    try{

        const hash = await Account.generateHash(pass);
        const oldAccount = await Account.find({username: username}).lean().exec();

        console.log(oldAccount);

        if(oldAccount.length === 0){
            return res.status(400).json({error: 'No such account exists.'});
        }

        //isnt working
        if(oldAccount === hash){
            return res.json({error: 'Password is the same as old password.'});
        }

        await Account.updateOne({
                username: username
            },
            {$set:{
                password: hash
            }
        })

        return res.status(201).json({ redirect: '/login' });
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'An error occured!' });
    }
}

const GetPremium = async (req, res) => {
    
}

module.exports = {
    loginPage,
    logout,
    login,
    signup,
    changePassword
}