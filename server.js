const express = require('express')
const { mongodb, MongoClient, ObjectID } = require('mongodb')


const app = express()
app.use(express.json())

const mongourl = "mongodb://localhost:27017"
const dbname = "contactManager"

MongoClient.connect(mongourl, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err
    console.log('data base est connecté')
    let db = client.db(dbname)

    //ajout des contacte:
    app.post('/newcontact', (req, res) => {
        db.collection('contacts').insertOne(req.body, (err, contact) => {
            if (err) throw err
            res.send(contact)

        })
    })

    //afficher les contactes:
    app.get('/allcontact', (req, res) => {
        db.collection('contacts').find().toArray((err, contact) => {
            if (err) throw err
            res.send(contact)
        })
    })
    //affiche un contact
    app.get('/contact/:id', (req, res) => {
        let contactID = ObjectID(req.params.id)
        db.collection('contacts').findOne({ _id: contactID }, (err, contact) => {
            if (err) throw err
            res.send(contact)
        })
    })
    //delete contact
    app.delete('/deletecontact/:id', (req, res) => {
        let contactID = ObjectID(req.params.id)
        db.collection('contacts').findOneAndDelete({ _id: contactID }, (err, data) => {
            if (err) res.send('contact no trouver')
            res.send(data)
        })
    })
    //update contacte
    app.put('/editcontact/:id', (req, res) => {
        let contactID = ObjectID(req.params.id)
        db.collection('contacts').findOneAndUpdate({ _id: contactID }, { $set: { ...req.body } }, (err, data) => {
            if (err) throw err
            //res.send('contact update')
            // retour le contact apres modification on fait:
            db.collection('contacts').findOne({ _id: contactID }, (err, contact) => {
                if (err) throw err
                res.send(contact)
            })
        })

    })




})

app.listen(5000, (err) => {
    if (err) throw err
    console.log('serveur en démarrage sur le port 5000')
})