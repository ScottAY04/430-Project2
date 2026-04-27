const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getGunplas', mid.requiresLogin, controllers.Gunpla.getGunpla);
    app.post('/finished', mid.requiresLogin, controllers.Gunpla.gunplaBuilt);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    //update passwords
    app.post('/changePass', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassword);
    

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Gunpla.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Gunpla.makeGunpla);
    app.get('/filtered', mid.requiresLogin, controllers.Gunpla.getGunplaByFilter);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    app.get('/*wild', controllers.Gunpla.NotFound);
}

module.exports = router;