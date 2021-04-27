const express = require('express')
const routes = express.Router()

const publicRoutes = require('./src/routes/public')
const adminRecipesRoutes = require('./src/routes/admin/recipes')
const adminChefsRoutes = require('./src/routes/admin/chefs')
const userAdminRoutes = require('./src/routes/admin/userAdmin')
const userRoutes = require('./src/routes/admin/user')

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