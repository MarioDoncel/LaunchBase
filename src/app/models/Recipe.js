const db = require('../../config/db')
const {date, formatList} = require('../../lib/utils')

module.exports = {
    all(callback){
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
    create(data){
        const query=`
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id
        `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    update(data, callback){
        const query = `
        UPDATE recipes SET 
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6)
        WHERE id=($7)
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.recipeId
        ]

        db.query(query, values,  function(err) {
            if(err) throw `DATABASE Error!${err}`

            callback()
        })
    },
    find(id){
        const query = `
        SELECT recipes.*, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `
        return db.query(query,[id])
    },
    delete(id, callback){
        const query = `
        DELETE FROM recipes WHERE id = $1
        `
        db.query(query,[id],  function(err) {
            if(err) throw `DATABASE Error!${err}`

            callback()
        })
    },
    chefOptions(){
        return db.query(`SELECT name, id FROM chefs`)
    },
    recipeFiles(id){
        return db.query(`
        SELECT * FROM recipe_files WHERE recipe_id = $1
        `, [id])
    },
    files(id){
        return db.query(`
        SELECT * FROM files WHERE id = $1
        `, [id])
    }

}