/**
 * Module dependencies.
 */
var mongoose =          require('mongoose'),
    utility =           require('../../lib/utility.js'),

    User = mongoose.model('User');

module.exports = {
    //Auth Callback
    authCallback: function (req, res, next) {
        res.redirect('/');
    },

    //Session
    session: function (req, res) {
        res.redirect('/');
    },

    //Default model
    standard: function (req, res, next) {
        var user = User.standard();
        res.send(200, user);
    },

    //Check if an email is unique
    checkMail: function (req, res) {
        var email = req.body.field;

        utility.checkUnique(email, User, 'email').then(function() {
            res.send(200);
        }).catch(function(err) {
            res.json(403, {isTaken: true});
        });
    },

    //Check if an username is unique
    checkName: function (req, res) {
        var username = req.body.field;

        utility.checkUnique(username, User, 'username').then(function() {
            res.send(200);
        }).catch(function(err) {
            res.json(403, {isTaken: true});
        });
    },

    //Send the current user
    current: function (req, res) {
        res.send(filterUserSmall(req.user));
    },

    //Send all the user information
    full: function (req, res) {
        res.send(filterUserFull(req.user));
    },

    //Find a user by id
    user: function (req, res, next, id) {
        User.findById(id).then(function(user) {
            req.profile = user;
            next()
        }).catch(function(err) {
            next(err);
        });
    },

    //Query the user collection
    query: function (req, res, next) {
        var query = JSON.parse(req.query.q);

        User.query(query).then(function(result) {
            if(result.length > 0) {
                res.send(result)
            } else {
                res.send(404, 'null')
            }
        }).catch(function(err) {
            res.send(404, 'null');
            console.log(err)
        })
    },

    update: function (req, res) {
        User.user(req.params.id, function (err, doc) {
            if (!err) {
                utility.updateDocument(doc, User, req.body);
                doc.save(function (err) {
                    if (!err) {
                        res.send(200,
                            {"messages": [
                                {"text": "All changes saved", "severity": "success"}
                            ]}
                        );
                    }
                    else {
                        res.send(400,
                            {"messages": [
                                {"text": "Something went wrong saving your request", "severity": "error"}
                            ]}
                        );
                    }
                });

            }
            else {
                res.send(400,
                    {"messages": [
                        {"text": "Something went wrong saving your request", "severity": "error"}
                    ]});
            }
        });
    }
};


//Small representation of a user
var filterUserSmall = function (user) {
    if (user) {
        return {
            user: {
                id: user._id.$oid,
                email: user.email,
                username: user.username,
                admin: user.admin
            }
        };
    } else {
        return { user: null };
    }
};

//Full representation of a user
var filterUserFull = function (user) {
    user = user.toObject();

    delete user.hashed_password;
    delete user.salt;

    return user;
};