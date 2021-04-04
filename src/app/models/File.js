const db = require('../../config/db')
const fs = require('fs')
const {date, formatList} = require('../../lib/utils')

module.exports = {
    async create({filename, path}, recipeId){
        const query=`
        INSERT INTO files (
            name,
            path
        ) VALUES ($1,$2)
        RETURNING id
        `
        const values = [
            filename,
            path
        ]

       let results = await db.query(query, values)
       const fileId = results.rows[0].id

       const queryRecipeFiles=`
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1,$2)
        RETURNING id
        `
        const valuesRecipeFiles = [
            recipeId,
            fileId
        ]
        return db.query(queryRecipeFiles, valuesRecipeFiles)
    },
    async avatarFileCreate({filename, path}, chefId){
        const query=`
        INSERT INTO files (
            name,
            path
        ) VALUES ($1,$2)
        RETURNING id
        `
        const values = [
            filename,
            path
        ]

       let results = await db.query(query, values)
       const fileId = results.rows[0].id

        const fileQuery=`
            UPDATE chefs SET 
            file_id=($1)
            WHERE id=($2)
        `
        const valueFile = [
            fileId,
            chefId
        ]
        return db.query(fileQuery, valueFile)
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }  

        await db.query(`
        DELETE FROM recipe_files where file_id = $1
        `, [id])

        return db.query(`
        DELETE FROM files where id = $1
        `, [id])
    },
    async avatarFileDelete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
            fs.unlinkSync(file.path)
        } catch (err) {
            console.error(err)
        }  

        return db.query(`
        DELETE FROM files where id = $1
        `, [id])
    },
}