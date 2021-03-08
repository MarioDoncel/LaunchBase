const db = require('../../config/db')
const {date}= require('../../lib/utils')

module.exports = {
    all(callback){
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.name ASC
            `
            db.query(query,  function(err, results) {
                if(err) throw `DATABASE Error!${err}`
    
                callback(results.rows)
            })
    },
    create(data, callback){
        const query=`
        INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1,$2,$3)
        RETURNING id
        `
        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values,  function(err) {
            if(err) throw `DATABASE Error!${err}`

            callback()
        })
    },
    find(id, callback){
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `
            db.query(query,[id],  function(err, results) {
                if(err) throw `DATABASE Error!${err}`
    
                callback(results.rows[0])
            })
    },
    update(data, callback){
        const query = `
        UPDATE chefs SET 
            name=($1),
            avatar_url=($2)
        WHERE id=($3)
        `
        const values = [
            data.name,
            data.avatar_url,
            data.chefId
        ]

        db.query(query, values,  function(err) {
            if(err) throw `DATABASE Error!${err}`

            callback()
        })
    },
    delete(id, callback){
        const query = `
        DELETE FROM chefs WHERE id = $1
        `
        db.query(query,[id],  function(err) {
            if(err) throw `DATABASE Error!${err}`

            callback()
        })
    },
    recipesByChef(id, callback){
        const query=`
        SELECT recipes.title, recipes.id,recipes.image, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = ${id}
        `
        db.query(query, function (err, results) {
            if(err) throw `DATABASE Error!${err}`
            callback(results.rows)
        })
    }
}