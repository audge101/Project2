const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
	title: { type: String, required: true},
	img1: String,
	img2: String,
	img3: String,
	link1: String,
	link2: String,
	recipeEntry: { type: String, required: true},
	healthGoals: Boolean,
	submitPublicFeed: Boolean,
	userID: String
})


const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe