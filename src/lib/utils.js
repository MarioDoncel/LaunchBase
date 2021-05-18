const FileRecipe = require('../app/models/FileRecipe')

module.exports = {
    date(timestamp){
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth()+1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso:`${year}-${month}-${day}`,
            format:`${day}/${month}/${year}`
        }
    },
    formatList(list){
        list = list.split('",')
        let index = 0
        list.forEach(element => {
            element = element.replace(/{/g, "").replace(/}/g, "").replace(/"/g, "")
            list[index] = element
            index++
        });
        return list
    },
    async filesWithSrc(recipe, req) {
            const recipeFiles = await FileRecipe.findAll({where: {recipe_id:recipe.id}})
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            }))  
            return await Promise.all(filesPromise) 
    },
    randomFile(item, files){
        const randomIndex = parseInt(Math.random() * files.length) 
        item.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
    },
    checkAllFields(body) {
        const keys = Object.keys(body)
        for (key of keys) {
            if (body[key] == "") {
                return {
                    user:body,
                    error: 'Por favor preencha todos os campos!'
                }
            }
        }
    }
}