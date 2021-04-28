const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require("method-override")
const session = require('./src/config/session')

const server = express()

server.use(session)
server.use(express.urlencoded({extended:true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.set('view engine', 'njk')

nunjucks.configure('src/app/views/', {
    express : server,
    autoescape: false,
    noCache: true
})

server.use(routes)


server.listen(5000, function() {
})