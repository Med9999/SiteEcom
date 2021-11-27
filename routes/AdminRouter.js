// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const express = require('express');
const multer = require("multer")
const router = express.Router();
const { addItem , addItemPage,LoginPage, Login ,getItems, Logout, deleteItem ,updateItem, getUpdateItem} = require('../controllers/adminController')

//chemin pour stocker les fichiers
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    var date = new Date().toISOString().substr(0, 10);
    cb(null, date + file.originalname)
  }
})

//le controle des fichiers acceptes
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
  cb(null, false);
};

// Multer pour l 'uploading des fichiers 
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// middelware pour s'assurer que le utilisateur est connecté
function isAuth (request, response, next) {
  if (!request.session.isAuth) {
    response.redirect('/admin/login');
  } else {
    next();
  }
};


function loginMid (request, response, next) {
  if (request.session.isAuth) {
    response.redirect('/admin/items');
  } else {
    next();
  }
};


router.get('/items',isAuth, getItems)

router.post('/addItem', upload.single('image'), addItem)

router.get('/addItem', addItemPage)

router.get('/login',loginMid, LoginPage)

router.get('/logout', Logout)

router.post('/login', loginMid ,Login)

router.post('/deleteItem/:id', deleteItem);

router.post('/updateItem/:id', upload.single('image'), updateItem);

router.get('/updateItem/:id', getUpdateItem);


module.exports = router;