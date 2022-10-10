'use strict';
const express = require('express');
const {check, validationResult} = require('express-validator'); // validation middleware
const cors = require('cors');
const studentDao = require('./dao/studentDao.js'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const coursesRouter = require('./routes/courseRoutes.js')
const students_coursesRoutes = require('./routes/students_coursesRoutes')


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({message: "Not Authenticated"});
}

const PORT = 3001;

let app = new express();


app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti
app.use(coursesRouter)
app.use(students_coursesRoutes)

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        new studentDao('study_plan.db').getStudent(email, password).then((student) => {
            if (!student)
                return done(null, false, {message: 'Incorrect email and/or password.'});

            return done(null, student);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((student, done) => {
    done(null, student.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    new studentDao('study_plan.db').getStudentById(id)
        .then(student => {
            done(null, student); // this will be available in req.user
        }).catch(err => {
        done(err, null);
    });
});

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

// POST /sessions
// login
app.post('/api/sessions',[
    check('email').isEmail()
] , async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    passport.authenticate('local', (err, student, info) => {
        if (err)
            return next(err);
        if (!student) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(student, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from studentDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

//logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.end();
    });
});

//getUser
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else
        res.status(401).json({error: 'Unauthenticated student!'});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
