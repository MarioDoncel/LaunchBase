const express = require('express')
const routes = express.Router()

const publicRoutes = require('./public')
const adminRecipesRoutes = require('./admin/recipes')
const adminChefsRoutes = require('./admin/chefs')
const userAdminRoutes = require('./admin/userAdmin')
const userRoutes = require('./admin/user')

// ========== Public Area ==========
routes.use('/', publicRoutes)

// ========== Admin Area ==========

// RECIPES
routes.use('/admin/recipes', adminRecipesRoutes)

// CHEFS
routes.use('/admin/chefs', adminChefsRoutes)

// USERS
routes.use('/admin/user', userRoutes)

// USER ADMIN
routes.use('/admin/userAdmin', userAdminRoutes)


module.exports = routes