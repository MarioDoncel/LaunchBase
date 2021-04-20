const express = require('express')
const routes = express.Router()

const publicRoutes = require('./src/routes/public')
const adminRecipesRoutes = require('./src/routes/admin/recipes')
const adminChefsRoutes = require('./src/routes/admin/chefs')
const adminProfileRoutes = require('./src/routes/admin/profile')
const adminUsersRoutes = require('./src/routes/admin/users')

// ========== Public Area ==========
routes.use('/', publicRoutes)

// ========== Admin Area ==========

// RECIPES
routes.use('/admin/recipes', adminRecipesRoutes)

// CHEFS
routes.use('/admin/chefs', adminChefsRoutes)

// PROFILE
routes.use('/admin/profile', adminProfileRoutes)

// USERS
routes.use('/admin/users', adminUsersRoutes)



module.exports = routes