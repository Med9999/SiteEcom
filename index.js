// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

var morgan = require('morgan');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var flash = require('connect-flash');



require('dotenv').config();

app.use('/images', express.static('images'));

//templete engine EJS
app.set('views', './views');
app.set('view engine', 'ejs');

//Middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//Session
app.use(session({
  secret: 'Mohssine-Mohammed',
  resave: false,
  saveUninitialized: false,
  // cookie ne s'eteint pas tant que on ne le 'destroy' pas
  cookie : {expires: new Date(253402300000000)},
}));

app.use(flash());


app.use(function(req, res, next) {
  res.locals = req.session;
  next();
});
 
//Connection au base de donnees Mongo Atlas
//Le fichier .env pour le stockage des url,logins,ports...
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo : Connecté avec succès'))
  .catch(() => console.log('Mongo : Echec de connexion à la base de données'))

//Routes
const itemRoutes = require('./routes/ItemRouter');
const adminRoutes = require('./routes/AdminRouter');



//Routes Middleware
app.use('/', itemRoutes);
app.use('/admin', adminRoutes);

//Configuration du serveur
var port = process.env.PORT || '3000';
app.set('port', port);
app.listen(port, () => { console.log("Port utilisé:" + port) });