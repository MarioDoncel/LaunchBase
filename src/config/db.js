const { Pool } = require('pg')

module.exports = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.DATABASE_URL,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
})

