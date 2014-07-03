var ctrl =  require('./user-controllers');
    auth =  require('./../auth.js');

module.exports = function (app) {
    app.namespace('/api/users', function () {

        //Username field checks
        app.post('/check/username', ctrl.checkName);
        app.post('/check/email', ctrl.checkMail);

        //Default user to easily add correct new items to the database
        app.get('/default', auth.adminRequired, ctrl.standard);

        app.get('/current', ctrl.full);

        app.get('/', auth.adminRequired, ctrl.query);
    });
};