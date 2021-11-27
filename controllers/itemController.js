// MOHSSINE AIT BOUKDIR - MOHAMMED ALOUT

const Item = require("../models/Item")
const Facture = require("../models/facture")
const nodemailer = require('nodemailer');

//------Item CONTROLLER, gestion des series


//Nodemailer config
//Nodemailer pour l'envoi des factures par email.  
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //l'email utilisé pour l'envoi des factures
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD,
    }
});

//Demande de toutes les series on se basant sur les valeurs des nom,min,max
exports.getItems = (req, res) => {
    if (req.query.nom) {
        Item.findOne({ title: { "$regex": req.query.nom, "$options": "i" } }, (err, data) => {
            if (data) { res.render('index', { items: [data] }) }
            res.render('index', { items: [] })
        })


    } else if (req.query.min || req.query.max || req.query.genre) {
    
        if (!req.query.min) req.query.min = 0;
        if (!req.query.max) req.query.max = 10000;
        if (!req.query.genre) req.query.genre = null;
        console.log("Min : "+req.query.min);  
        console.log("Max : "+req.query.max);
        console.log("genre : "+req.query.genre);


        Item.find({ price: { $lte: req.query.max , $gte: req.query.min }, genre: req.query.genre })
            .then(data => res.render('index', { items: data }))
            .catch(err => { res.send(err) })

    } else {
        Item.find()
            .then(data => {
                res.render('index', { items: data })
            })
            .catch(err => { res.send(err) });
    }
}

//Demande d'une seule serie par id
exports.getOneItem = async (req, res) => {
    await Item.findById({ _id: req.params.id })
        .then(data => res.render('item', { item: data }))
        .catch(err => res.json(err))
}


// FACTURES

//Demande d'une seule facture par id
exports.getFacture = (req, res) => {
    res.render('facture', { id: req.params.id });
}

//L'ajout d'une facture au base de donnees
exports.addFacture = async (req, res) => {
    if (req.body.nom && req.body.email && req.params.id) {
        let facture = Facture({
            nom: req.body.nom,
            email: req.body.email,
            item: req.params.id
        })

        facture.save(async (err, fac) => {
            if (err) {
                res.render('facture', { id: req.params.id })
            } else {
                
                var serie = await Item.findById({ _id: req.params.id });
                //Le corps du message email
                var txt = "Bonjour cher "+req.body.nom+",\n \nVotre commande est bien recu. \n\n*****************\n\nTitre : "+serie.title+"\n\nGenre : "+serie.genre+"\n\nDescription : "+serie.content+"\n\nPrix : "+serie.price+"€\n\n*****************\n  \nMerci pour votre confiance.";                    
                
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: fac.email,
                    subject: 'Facture de commande',
                    text: txt
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.json({ error: err })
                    }
                    res.redirect('/')
                })

            }
        })

    } else {
        res.redirect('/')
    }


}