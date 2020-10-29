const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipes.js')


const isAuthenticated = (req, res, next) =>  {
	if (req.session.currentUser) {
		console.log(req.session.currentUser)
    return next()
	} else {
		res.redirect('/sessions/new')
	}
}

router.get('/new', isAuthenticated, (req, res) => {
	res.render('recipes/new.ejs', { currentUser: req.session.currentUser })
})

router.post('/', isAuthenticated, (req, res) => {
	if (req.body.healthGoals === 'on') {
		req.body.healthGoals = true
	} else {
		req.body.healthGoals = false
	}
  if (req.body.submitPublicFeed === 'on') {
    req.body.submitPublicFeed = true
  } else {
    req.body.submitPublicFeed = false
  }
  const bodyData = {
    ... req.body, 
    userID: req.session.currentUser._id
  }
	Recipe.create(bodyData, (error, createdRecipe) => {
		res.redirect('/recipes')
	})
})

router.get('/', isAuthenticated, (req, res)=>{
    Recipe.find({userID: req.session.currentUser._id}, (error, allRecipes)=>{
        res.render('recipes/index.ejs', {
            recipes: allRecipes,
						currentUser: req.session.currentUser
        })
    })
})

/*
router.get('/seed', (req, res)=>{
    Recipe.create([
        {
            name:'grapefruit',
            color:'pink',
            readyToEat:true
        },
        {
            name:'grape',
            color:'purple',
            readyToEat:false
        },
        {
            name:'avocado',
            color:'green',
            readyToEat:true
        }
    ], (err, data)=>{
        res.redirect('/fruits');
    })
});

*/

router.get('/:id', isAuthenticated, (req, res) => {
	Recipe.findById(req.params.id, (err, foundRecipe) => {
		res.render('recipes/show.ejs', {
			recipe: foundRecipe,
			currentUser: req.session.currentUser
		})
	})
})


router.get('/:id/edit', isAuthenticated, (req, res) => { //isAuthenticated
  Recipe.findById(req.params.id, (err, foundRecipe) => {
    res.render('recipes/edit.ejs', {
      recipe: foundRecipe,
			currentUser: req.session.currentUser
    })
  })
})


router.put('/:id', isAuthenticated, (req, res) => {
  if (req.body.healthGoals === 'on') {
    req.body.healthGoals = true
  } else {
    req.body.healthGoals = false
  }
  if (req.body.submitPublicFeed === 'on') {
    req.body.submitPublicFeed = true
  } else {
    req.body.submitPublicFeed = false
  }
  Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedModel) => {
    res.redirect('/recipes')
  })
})


router.delete('/:id', isAuthenticated, (req, res) => {
  Recipe.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/recipes')
  })
})


module.exports = router