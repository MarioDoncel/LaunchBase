const db = require('../../config/db')
const {date}= require('../../lib/utils')


module.exports = {
    all(){
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.name ASC
            `
            return db.query(query)
    },
    create(data){
        const query=`
        INSERT INTO chefs (
            name,
            created_at
        ) VALUES ($1,$2)
        RETURNING id
        `
        const values = [
            data.name,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    find(id){
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `
            return db.query(query,[id])
    },
    update(data){
        const query = `
        UPDATE chefs SET 
            name=($1)
        WHERE id=($2)
        `
        const values = [
            data.name,
            data.chefId
        ]

        return db.query(query, values)
    },
    delete(id){
        const query = `
        DELETE FROM chefs WHERE id = $1
        `
        return db.query(query,[id])
    },
    recipesByChef(id){
        const query=`
        SELECT recipes.title, recipes.id, 
        chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = ${id}
        `
        return db.query(query)
    },
    file(id){
        return db.query(`
        SELECT * FROM files WHERE id = $1
        `, [id])
    }
}