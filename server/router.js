const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getGunplas', mid.requiresLogin, controllers.Gunpla.getGunpla);
    app.get('/filtered', mid.requiresLogin, controllers.Gunpla.getGunplaByFilter);
    app.post('/finished', mid.requiresLogin, controllers.Gunpla.gunplaBuilt)

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    //update passwords
    app.post('/changePass', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassword);

    //premium subscription page here
    

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Gunpla.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Gunpla.makeGunpla);
    //app.post('/changeDomo', mid.requiresLogin, controllers.Domo.changeDomo);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
}

module.exports = router;