'use strict'

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/mydb", (err, res) => {
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
app.post("/api-bank/user", (req, res) => {
    //console.log("POST /api-bank/user")
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
app.get("/api-bank/user", (req, res) => {
	User.find({}, (err, users) => {
		if(err) return res.status(500).send({message: "Error with the request "+ err})
		if(!users) return res.status(404).send({message: "Users not found"})

		res.send(200, {users})
	})
})

// accounts only one user
app.get("/api-bank/user/:idUser", (req, res) => {
	let idUser = req.params.idUser

	User.find({id: idUser}, (err, user) => {
		if(err) return res.status(500).send({message: "Error with the request "+ err})
		if(!user || user.length==0) return res.status(404).send({message: "User not found"})

		res.status(200).send({user})
	})
})

// specific account
app.get("/api-bank/user/:idUser/:numberAcc", (req, res) => {
	let idUser = req.params.idUser
	let numberAcc = req.params.numberAcc

	User.findOne({id: idUser, numberAcc: numberAcc}, (err, user) => {
		if(err) return res.status(500).send({message: "Error with the request "+ err})
		if(!user || user.length==0) return res.status(404).send({message: "User not found"})

		res.status(200).send({user})
	})
})


// PUT

// update user data
app.put("/api-bank/user/:idUser", (req, res) => {
	let idUser = req.params.idUser
	let body = req.body

	User.findByIdAndUpdate(idUser, body, (err, updatedUser) => {
		if(err) res.status(500).send({message: "Error user not update: "+ err})

		res.status(200).send({user: updatedUser})
	})
})

//update balance
app.put("/api-bank/user/:idUser/:numberAcc", (req, res) => {
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
app.delete("/api-bank/user/:idUser", (req, res) => {
	let idUser = req.params.idUser

	User.findOne({id: idUser}, (err, user) => {
		if(err) res.status(500).send({mesage: "Error user not deleted: "+ err})

		user.remove(err => {
			if(err) res.status(500).send({mesage: "Error user not deleted: "+ err})
			res.status(200).send({message: "User deleted"})
		})
	})
})