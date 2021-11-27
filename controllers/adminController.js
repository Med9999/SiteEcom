// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const Item = require("../models/Item")

//------ADMIN CONTROLLER, toutes ces fonctionnalités sont pour l'admin

//Login Page
exports.LoginPage = (req, res) => {
    res.render('./Admin/login');
}

//Page d'ajout
exports.addItemPage = (req, res) => {
    res.render('./Admin/addItem');
}

//Page de modification
exports.getUpdateItem = (req,res)=>{
    res.render('./Admin/updateItem', {id : req.params.id});
}

//Ajout d'une serie
exports.addItem = (fields, res) => {
    if (fields.body && fields.file) {
        let item = new Item({
            title: fields.body.title,
            content: fields.body.content,
            price: fields.body.price,
            genre: fields.body.genre,
            image: new Date().toISOString().substr(0, 10) + fields.file.originalname,
        });

        item.save((err, Item) => {
            if (err) {
                fields.flash('message', 'Erreur !')
                return res.render("/admin/addItem", { message: fields.flash('message') })
            }

            fields.session.ajout = Item.title + " est bien ajoutée";

            return res.redirect("/admin/items")

        })
    } else {
        fields.flash('message', 'SVP remplissez tous les champs !')
        return res.render("./Admin/addItem", { message: fields.flash('message') })
    }

}


//Login pour l'admin
exports.Login = (req, res) => {
    let mail = req.body.email;
    let pass = req.body.password;
    if (mail && pass) {
        if (mail == process.env.ADMIN_EMAIL && pass == process.env.ADMIN_PASSWORD) {
            req.session.isAuth = true
            return res.redirect('/admin/items')
        }

        req.flash('message', 'Email ou Mot de passe incorrecte')
        return res.render('./Admin/login', { message: req.flash('message') });
    }
    req.flash('message', 'Remplissez tous les champs !')
    return res.render('./Admin/login', { message: req.flash('message') });
}


//Demande de toutes les series
exports.getItems = (req, res) => {
    Item.find()
        .then(data => {
            res.render('./Admin/items', { items: data.reverse() })
        })
        .catch(err => { res.send(err) });
}

//Deconnexion pour admin
exports.Logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) throw error;
        return res.redirect('/');
    });
}

//Suppression d'une serie
exports.deleteItem = (req, res)=>{
    Item.findByIdAndDelete({_id : req.params.id})
    .then(data => res.redirect('/admin/items'))
    .catch(err => { res.send(err)})
}

//Modification d'une serie
exports.updateItem = (req,res)=>{
    let item = new Item({
        _id : req.params.id,
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        genre: req.body.genre,
        image: new Date().toISOString().substr(0, 10) + req.file.originalname,
    });
    Item.findByIdAndUpdate(req.params.id, item)
    .exec(function (err) {
        if (!err) {
          return res.redirect('/admin/items')
        }
        else {
          return res.send("*********************** "+err)
        }
      })
}


