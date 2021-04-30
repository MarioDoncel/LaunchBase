const db = require('../../config/db')
const { date, formatList } = require('../../lib/utils')

module.exports = {
    all() {
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
    create(data, userId) {
        try {
            const query = `
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at,
            updated_at,
            user_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id
        `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).iso,
                date(Date.now()).iso,
                userId
            ]

            return db.query(query, values)
        } catch (error) {
            console.log(error)
        }
    },
    update(data) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    },
    find(id) {
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
    delete(id) {
        try {
            const query = `
        DELETE FROM recipes WHERE id = $1
        `
            return db.query(query, [id])
        } catch (error) {
            console.log(error)
        }
    },
    chefOptions() {
        try {
            return db.query(`SELECT name, id FROM chefs`)
        } catch (error) {
            console.log(error)
        }
    },
    recipeFiles(id) {
        try {
            return db.query(`
        SELECT * FROM recipe_files WHERE recipe_id = $1
        `, [id])
        } catch (error) {
            console.log(error)
        }
    },
    files(id) {
        try {
            return db.query(`
        SELECT * FROM recipe_files WHERE id = $1
        `, [id])
        } catch (error) {
            console.log(error)
        }
    }
}