const db = require('../../config/db')
const fs = require('fs')
const { date, formatList } = require('../../lib/utils')

module.exports = {
    async create({ filename, path }, recipeId) {
        try {
            const queryRecipeFiles = `
            INSERT INTO recipe_files (
                recipe_id,
                name,
                path
            ) VALUES ($1,$2,$3)
            RETURNING id
            `
            const valuesRecipeFiles = [
                recipeId,
                filename,
                path
            ]
            return db.query(queryRecipeFiles, valuesRecipeFiles)
        } catch (error) {
            console.log(error)
        }
    },
    async avatarFileCreate({ filename, path }, chefId) {
        try {
            const query = `
            INSERT INTO chef_files (
                name,
                path, 
                chef_id
            ) VALUES ($1,$2,$3)
            RETURNING id
            `
            const values = [
                filename,
                path,
                chefId
            ]

            return db.query(query, values)
            
        } catch (error) {
            console.log(error)
        }

    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM recipe_files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }
        try {
            await db.query(`
            DELETE FROM recipe_files where id = $1
            `, [id])

        } catch (error) {
            console.log(error)
        }

    },
    async avatarFileDelete(id) {
        try {
            const result = await db.query(`SELECT * FROM chef_files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }
        try {
            return db.query(`
            DELETE FROM chef_files where id = $1
            `, [id])
        } catch (error) {
            console.log(error)
        }

    },
}