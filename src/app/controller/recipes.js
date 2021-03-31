const Recipe = require('../models/Recipe')
const File = require('../models/File')
const {date, formatList} = require('../../lib/utils')


module.exports = {
    index(req, res) {
        Recipe.all(function (recipes) {
            return res.render("admin/recipes/recipes", {recipes})
        })
    },
    async create(req, res) {
        let results =await Recipe.chefOptions()
        const chefs = results.rows
        return res.render("admin/recipes/create", {chefs})
        
    },
    async show(req, res) {
        let recipeId = req.params.id
    
        let results = await Recipe.find(recipeId)
        const recipe = results.rows[0]
        
        if(!recipe) return res.send ('Recipe não encontrado!')

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)
        
        return res.render("admin/recipes/show", {recipe})
    },
    async edit(req, res) {
        let recipeId = req.params.id

        let results = await Recipe.find(recipeId)
        const recipe = results.rows[0]

        if(!recipe) return res.send ('Recipe não encontrado!')
            
        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)
    
        results = await Recipe.chefOptions()
        const chefs = results.rows

        results = await Recipe.recipeFiles(recipeId)
        const recipeFiles = results.rows //{ id: 1, recipe_id: 12, file_id: 2 } { id: 2, recipe_id: 12, file_id: 3 }
        
        const filesPromise = recipeFiles.map( recipeFile => Recipe.files(recipeFile.file_id)) 
        results = await Promise.all(filesPromise) // resulta em um array de results que para colher resultado usar map ou forEach
        // results.forEach(results => console.log(results.rows[0]))
        let files = results.map(results=>results.rows[0])
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))
        
        return res.render("admin/recipes/edit", {recipe, recipeId, chefs, files})
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        //validação de todos os campos preenchidos
        keys.forEach(key => {
            if(req.body[key]==""){
                return res.send("Todos os campos são obrigatorios")
            }
        });
        // Validação de imagens enviadas
        if(req.files.length == 0) return res.send('Por favor envie pelo menos uma imagem.')

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file =>  File.create({...file}, recipeId)) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia
        
        return res.redirect('recipes')
    },
    async put(req, res) {
        const recipeId = req.body.recipeId
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (key == "" && key != "removed_files") {
                return res.send("Por favor preencha todos os campos")
            }
        }
        
        if (req.files.length != 0) {
            const newFilesPromisse = req.files.map(file => 
                File.create({...file}, recipeId))
                await Promise.all(newFilesPromisse)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            removedFiles.pop()

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)

        return res.redirect('recipes')
    },
    delete(req, res) {
        const recipeId = req.body.recipeId
        
        Recipe.delete(recipeId, function () {
            return res.redirect('recipes')
        })
    }
}
