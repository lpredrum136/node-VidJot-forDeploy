const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// PASSPORT CONFIG
require('./config/passport')(passport);// Immediately pass in a Passport instance

// DB config. If offline, use localhost db. If not, use cloud mLab
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {//mongodb+srv://lpredrum136:<password>@vidjot-prod-lj3an.mongodb.net/test?retryWrites=true&w=majority
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// How Middleware works
/*app.use((req, res, next) => {
    // console.log(Date.now());
    req.name = 'Henry';
    next();
});*/

// Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder: Tell app this is the static folder with css, front-end views, images.
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',// anything you like
    resave: true,// Def: false
    saveUninitialized: true//,
    // cookie: { secure: true }
}));

// Passport middleware. NOTE: MUST BE PUT AFTER EXPRESS SESSION MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());
/*app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
});*/

// SET GLOBAL VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');// success_msg o ve ben trai la gi cung duoc
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;// When passport logged you in, in creates a request object called "user". So we save it in a global
                                    // var with res.locals.user = req.user or null if there is no user object/not logged in
                                    // and we can use that anywhere, eg. hide Login and Register route
    next();
});

//=====================MAIN ROUTES ==============

// Index route
app.get('/', (req, res) => {
    // console.log(req.name);
    const title = 'Welcome';
    res.render('index', {
        title: title
    }); 
    // res.send(req.name);
});

app.get('/about', (req, res) => {
    res.render('about');
});

// USE USER ROUTES
app.use('/users', users);

// USE IDEAS ROUTES
app.use('/ideas', ideas);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});