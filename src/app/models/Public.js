const db = require('../../config/db')

module.exports = {
    allRecipes(callback){
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC
        `
        db.query(query,  function(err, results) {
            if(err) throw `DATABASE Error!${err}`

            callback(results.rows)
        })

    },
    allChefs(callback){
        const query = `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY created_at DESC
        `
        db.query(query,  function(err, results) {
            if(err) throw `DATABASE Error!${err}`

            callback(results.rows)
        })

    },
    findRecipe(id, callback){
        const query = `
        SELECT recipes.*, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `
        db.query(query,[id],  function(err, results) {
            if(err) throw `DATABASE Error!${err}`

            callback(results.rows[0])
        })
    },
    filterRecipes(filter, callback){
        const query=`
        SELECT recipes.title, recipes.id,recipes.image, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%' or chefs.name ILIKE '%${filter}%'
        `
        db.query(query, function (err, results) {
            if(err) throw `DATABASE Error!${err}`
            callback(results.rows)
        })
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