const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'chefs'})

const Chef =  { 
    ...Base,
    async all(){
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.name ASC
            `
            const results = await db.query(query)
            return results.rows
        } catch (error) {
            console.log(error)
        }
    },
    async find(id){
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `
            const results = await db.query(query,[id])
            return results.rows[0]
        } catch (error) {
            console.log(error)
        }
        
    },
    async recipesByChef(id){
        try {
            const query=`
            SELECT recipes.title, recipes.id, 
            chefs.name AS chef_name 
            FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = ${id}
            `
            const results = await db.query(query)
            return results.rows
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Chef