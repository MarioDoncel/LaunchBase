const express = require('express')
const AWS = require('aws-sdk')
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

//IMAGES FROM S3
routes.get('/images/:imageId', function (req, res, next) {
  const params = { Bucket: 'foodfy-doncel', Key: req.params.imageId };
  const s3 = new AWS.S3({
    region: 'sa-east-1',
  })
  s3.getObject(params, function (err, data) {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
  });
});


module.exports = routes