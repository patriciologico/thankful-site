// load up the user model
var HappyThought       		= require('./models/happy_thought');

//i18n
var i18n = require("i18n");

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });

    // =====================================
    // LOGIN OR SIGN UP ====================
    // =====================================

    // process the login form
    app.post('/login', passport.authenticate('local-login-signup', {
        successRedirect : '/diary', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // DIARY SECTION =======================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/diary', isLoggedIn, function(req, res) {
        var selected_date = req.query.selected_date;
        var date = new Date()
        if(selected_date){
            date = new Date(selected_date);
        }
        date = date.setHours(0,0,0,0)
        HappyThought.find({'user_id': req.user.id, 'created_at': date},
            function ( err, thoughts, count ){
                res.render( 'diary.ejs', {
                    user : req.user,
                    message: req.flash('loginMessage'),
                    done: thoughts.length == 3 ? true : false,
                    thoughts : thoughts,
                    enabled: date==(new Date()).setHours(0,0,0,0) ? true : false,
                    locale: req.getLocale()
                });
        });
    });

    app.post('/post', function(req, res){
        new HappyThought({
            user_id    : req.user.id,
            content    : req.body.content,
            created_at : (new Date()).setHours(0,0,0,0),
            updated_at : Date.now()
        }).save( function( err ){
            res.redirect( '/diary' );
        });
    });

    app.get('/destroy/:id', function(req, res){
        HappyThought.findById( req.params.id, function ( err, thought ){
            thought.remove( function ( err, thought ){
                res.redirect( '/diary' );
            });
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
