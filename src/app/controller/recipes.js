const Recipe = require('../models/Recipe')
const File = require('../models/File')
const {date, formatList, addSRC} = require('../../lib/utils')


module.exports = {
    async index(req, res) {
        let results = await Recipe.all()
        const recipes = results.rows
        
        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            results = await Recipe.recipeFiles(recipe.id)

            const recipeFiles = results.rows //{ id: 1, recipe_id: 12, file_id: 2 } { id: 2, recipe_id: 12, file_id: 3 }
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            }))  
            let files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        
        return res.render("admin/recipes/recipes", {
            recipes, 
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    async create(req, res) {
        let results =await Recipe.chefOptions()
        const chefs = results.rows
        return res.render("admin/recipes/create", {
            chefs,
            recipe:req.flash('recipe')[0],
            message:{
                error: req.flash('error'),
                success: req.flash('success')
            }})
        
    },
    async show(req, res) {
        let recipeId = req.params.id
    
        let results = await Recipe.find(recipeId)
        const recipe = results.rows[0]
        
        if(!recipe) {
            req.flash('error', 'Receita não encontrada.')
            return res.redirect ('/admin/recipes')
        }

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        results = await Recipe.recipeFiles(recipeId)
        const recipeFiles = results.rows 
        
        const filesPromise = recipeFiles.map( recipeFile => ({
            ...recipeFile,
            src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
        })) 
        let files = await Promise.all(filesPromise) 
               
        return res.render("admin/recipes/show", {
            recipe, 
            files,
            message:{
                error: req.flash('error'),
                success: req.flash('success')
            }})
    },
    async edit(req, res) {
        let recipeId = req.params.id

        let results = await Recipe.find(recipeId)
        const recipe = results.rows[0]

        if(!recipe) {
            req.flash('error', 'Receita não encontrada.')
            return res.redirect ('/admin/recipes')
        }
            
        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)
    
        results = await Recipe.chefOptions()
        const chefs = results.rows

        results = await Recipe.recipeFiles(recipeId)
        const recipeFiles = results.rows //{ id: 1, recipe_id: 12, file_id: 2 } { id: 2, recipe_id: 12, file_id: 3 }
        
        const filesPromise = recipeFiles.map( recipeFile => ({
            ...recipeFile,
            src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
        })) 
        
        let files = await Promise.all(filesPromise) 
        
        
        return res.render("admin/recipes/edit", {
            recipe,
            recipeId, 
            chefs, 
            files,
            message:{
                error: req.flash('error'),
                success: req.flash('success')
            }})
    },
    async post(req, res) {
        const userId = req.session.userId
        const keys = Object.keys(req.body)
        // validação de todos os campos preenchidos - Utilizado FOR OF ao inves do FOREACH para
        // que o processo de verificação seja sincrono 
        for (const key of keys) {
            if(req.body[key]==""){
                req.flash('error', 'Todos os campos são obrigatorios!')
                req.flash('recipe', req.body)
                return res.redirect('/admin/recipes/create')
            }
        }

        // Validação de imagens enviadas
        if(req.files.length == 0) {
            req.flash('error', 'Por favor envie uma imagem de avatar.')
            req.flash('recipe', req.body)
            return res.redirect('/admin/recipes/create')
        }

        let results = await Recipe.create(req.body, userId)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file =>  File.create({...file}, recipeId)) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia
        
        req.flash('success', 'Receita criada com sucesso.')
        return res.redirect('/admin/recipes')
    },
    async put(req, res) {
        const recipeId = req.body.recipeId
        const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" ) {
                req.flash('error', 'Por favor preencha todos os campos.')
                return res.redirect(`/admin/recipes/${recipeId}/edit`)
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

        req.flash('success', 'Receita atualizada com sucesso.')
        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async delete(req, res) {
        const recipeId = req.body.recipeId

        let results = await Recipe.recipeFiles(recipeId)
        const recipeFiles = results.rows

        const filesPromise = recipeFiles.map(file =>  File.delete(file.file_id)) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia
        
        await Recipe.delete(recipeId)
        
        req.flash('success', 'Receita excluída com sucesso.')
        return res.redirect('recipes')  
    }
}
