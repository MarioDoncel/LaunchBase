const db = require('../../config/db')
const Base = require('./Base')


Base.init({table: 'recipes'})

const Recipe =  { 
    ...Base,
    async all() {
        try {
            const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            ORDER BY created_at DESC
            `
            const results =await db.query(query)
            return results.rows
        } catch (error) {
            console.log(error)
        }
    },
    async find(id) {
        try {
            const query = `
        SELECT recipes.*, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `
            const results =await db.query(query, [id])
            return results.rows[0]
        } catch (error) {
            console.log(error)
        }
    },
    async filterRecipes(filter) {
        try {
            const query = `
        SELECT recipes.title, recipes.id, recipes.updated_at, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%' or chefs.name ILIKE '%${filter}%'
        ORDER BY updated_at DESC
        `
            const results = await db.query(query)
            return results.rows
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = Recipe