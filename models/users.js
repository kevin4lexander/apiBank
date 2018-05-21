'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = Schema({
	id: Number,
	name: String,
	lname: String,
	bankAcc: String,
	numberAcc: Number,
	typeAcc: { type: String, enum: ['credit','current','investment','loan','saving'] },
	balanceAcc: { type: Number, default: 0 },
	keyAcc: Number
})

module.exports = mongoose.model('User', UserSchema)