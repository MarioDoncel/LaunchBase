const db = require('../../config/db')
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
}