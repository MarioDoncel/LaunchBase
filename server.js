require('dotenv').config()
const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./src/routes/routes')
const methodOverride = require("method-override")
const session = require('./src/config/session')
const flash = require('connect-flash');
const server = express()

server.use(session)
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.set('view engine', 'njk')


//configurações connect-flash - para envio de mensagens no redirect
server.use(flash());

nunjucks.configure('src/app/views/', {
    express: server,
    autoescape: false,
    noCache: true
})

server.use(routes)


server.listen(process.env.PORT || 5000, function () {
    console.log('Server is running')
})