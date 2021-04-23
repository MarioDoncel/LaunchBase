const express = require('express')
const routes = express.Router()

const publicRoutes = require('./src/routes/public')
const adminRecipesRoutes = require('./src/routes/admin/recipes')
const adminChefsRoutes = require('./src/routes/admin/chefs')
const userAdminRoutes = require('./src/routes/admin/userAdmin')
const adminUsersRoutes = require('./src/routes/admin/users')

// ========== Public Area ==========
routes.use('/', publicRoutes)

// ========== Admin Area ==========

// RECIPES
routes.use('/admin/recipes', adminRecipesRoutes)

// CHEFS
routes.use('/admin/chefs', adminChefsRoutes)

// USERS
routes.use('/admin/users', adminUsersRoutes)

// USER ADMIN
routes.use('/admin/userAdmin', userAdminRoutes)


module.exports = routes