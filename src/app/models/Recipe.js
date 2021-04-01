const db = require('../../config/db')
const {date, formatList} = require('../../lib/utils')

module.exports = {
    all(){
        const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
        ORDER BY created_at DESC
        `
        return db.query(query)

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
    update(data){
        const query = `
        UPDATE recipes SET 
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id=($6)
        `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.recipeId
        ]

        return db.query(query, values)
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
    delete(id){
        const query = `
        DELETE FROM recipes WHERE id = $1
        `
        return db.query(query,[id])
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