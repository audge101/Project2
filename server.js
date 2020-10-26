const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
require('dotenv').config()
//const bootstrap = require('bootstrap')

const app = express()


const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI


app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'))

app.use(express.static('public'))

// sessions
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)


mongoose.connect(mongodbURI, { useNewUrlParser: true});
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo')
})

// controllers
const recipesController = require('./controllers/recipes.js')
app.use('/recipes', recipesController)

const usersController = require('./controllers/users.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)


app.get('/', (req, res) => {
  res.render('home.ejs', { currentUser: req.session.currentUser })
})

app.listen(PORT, ()=> {
	console.log("Hello, listening on port: ", PORT)
})