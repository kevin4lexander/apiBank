'use strict'

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.connect("mongodb://easyfinance:easyf2018@ds129560.mlab.com:29560/apibank", (err, res) => {
    if (err) {
        return console.log("Error conecting to DB: " + err)
    }
    console.log("Conected to DB...")

    app.listen(port, () => {
        console.log("API running on http://localhost:" + port)
    })
})
const port = process.env.PORT || 3001

const User = require("./models/users")
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// POST
app.post("/user", (req, res) => {
    //console.log("POST /user")
    //console.log(req.body)

    let user = new User()
    user.id = req.body.id
    user.name = req.body.name
    user.lname = req.body.lname
    user.bankAcc = req.body.bankAcc
    user.numberAcc = req.body.numberAcc
    user.typeAcc = req.body.typeAcc
    user.balanceAcc = req.body.balanceAcc
    user.keyAcc = req.body.keyAcc

    user.save((err, userSaved) => {
        if(err) res.status(500).send({message: "Unsaved user error: "+ err})
        res.status(200).send({user: userSaved})
    })
})


// GET

// all user
app.get("/user", (req, res) => {
    User.find({}, (err, users) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!users || users.length==0) return res.status(404).send({message: "Empty"})

        res.send(200, {users})
    })
})

// accounts of only one user
app.get("/user/:idUser", (req, res) => {
    let idUser = req.params.idUser

    User.find({id: idUser}, (err, accounts) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!accounts || accounts.length==0) return res.status(404).send({message: "Account not found"})
accounts
        res.status(200).send({accounts})
    })
})

// cuentas de un banco, tipo y usuario especificos
app.get("/typeAcc/:bank/:typeAcc/:idUser", (req, res) => {
    let idUser = req.params.idUser
    let bank = req.params.bank
    let typeAcc = req.params.typeAcc

    User.find({id: idUser, bankAcc: bank, typeAcc: typeAcc}, (err, account) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!account || account.length==0) return res.status(404).send({message: "Account not found"})

        res.status(200).send({account})
    })
})

// cuentas de una banco y usuario especificos
app.get("/bankAcc/:bank/:idUser", (req, res) => {
    let idUser = req.params.idUser
    let bank = req.params.bank

    User.find({id: idUser, bankAcc: bank}, (err, account) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!account || account.length==0) return res.status(404).send({message: "Account not found"})

        res.status(200).send({account})
    })
})

// cuenta especifica de un usuario
app.get("/user/:idUser/:numberAcc", (req, res) => {
    let idUser = req.params.idUser
    let numberAcc = req.params.numberAcc

    User.findOne({id: idUser, numberAcc: numberAcc}, (err, account) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!account || account.length==0) return res.status(404).send({message: "User not found"})

        res.status(200).send({account})
    })
})

// verificar numero de cuenta y clave de una cuenta bancaria de usuario
app.get("/:idUser/:numberAcc/:key", (req, res) => {
    let idUser = req.params.idUser
    let numberAcc = req.params.numberAcc
    let key = req.params.key

    User.findOne({id: idUser, numberAcc: numberAcc, keyAcc: key}, {numberAcc}, (err, account) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!account || account.length==0) return res.status(404).send({message: "User not found"})

        res.status(200).send({account})
    })
})

// verificar clave de una cuenta bancaria de usuario
app.get("/account/:idUser/:bankAcc/:key", (req, res) => {
    let idUser = req.params.idUser
    let bankAcc = req.params.bankAcc
    let key = req.params.key

    User.find({id: idUser, bankAcc: bankAcc, keyAcc: key}, (err, account) => {
        if(err) return res.status(500).send({message: "Error with the request "+ err})
        if(!account || account.length==0) return res.status(404).send({message: "User not found"})

        res.status(200).send({account})
    })
})

// PUT

// update user data
app.put("/user/:idUser", (req, res) => {
    let idUser = req.params.idUser
    let body = req.body

    User.findByIdAndUpdate(idUser, body, (err, updatedUser) => {
        if(err) res.status(500).send({message: "Error user not update: "+ err})

        res.status(200).send({user: updatedUser})
    })
})

//update balance of account
app.put("/user/:idUser/:numberAcc", (req, res) => {
    let idUser = req.params.idUser
    let numberAcc = req.params.numberAcc
    let balance = req.body.balanceAcc
    //let body = req.body

    User.findOneAndUpdate({id: idUser, numberAcc: numberAcc}, {balanceAcc: balance}, (err, user) => {
        if(err) res.status(500).send({message: "Error updating account balance "+ err})
        
        res.status(200).send({user})
    })
})


// DELETE

//delete user
app.delete("/user/:idUser", (req, res) => {
    let idUser = req.params.idUser

    User.findOne({id: idUser}, (err, user) => {
        if(err) res.status(500).send({mesage: "Error user not deleted: "+ err})

        user.remove(err => {
            if(err) res.status(500).send({mesage: "Error user not deleted: "+ err})
            res.status(200).send({message: "User deleted"})
        })
    })
})