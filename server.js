if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'.env'})
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const indexRouter =require('./routes/index')
const authorRouter =require('./routes/authors')
const bookRouter =require('./routes/books')
const usersRouter =require('./routes/users')
require('./config/passport')(passport)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

// Global variables
app.use((req, res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/users', usersRouter)

app.listen(process.env.PORT || 3000)