const db = require('../../config/db')

module.exports = {
    allRecipes() {
        try {
            const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC
        `
            return db.query(query)
        } catch (error) {
            console.log(error)
        }

    },
    allChefs() {
        try {
            const query = `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY created_at DESC
        `

            return db.query(query)
        } catch (error) {
            console.log(error)
        }

    },
    findRecipe(id) {
        try {
            const query = `
        SELECT recipes.*, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `
            return db.query(query, [id])
        } catch (error) {
            console.log(error)
        }

    },
    filterRecipes(filter) {
        try {
            const query = `
        SELECT recipes.title, recipes.id, recipes.updated_at, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%' or chefs.name ILIKE '%${filter}%'
        ORDER BY updated_at DESC
        `
            return db.query(query)
        } catch (error) {
            console.log(error)
        }

    }
    // findChef(id, callback){
    //     const query = `
    //     SELECT recipes.*, 
    //     chefs.name AS chef_name 
    //     FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    //     WHERE recipes.id = $1
    //     `
    //     db.query(query,[id],  function(err, results) {
    //         if(err) throw `DATABASE Error!${err}`

    //         callback(results.rows[0])
    //     })
    // }
}