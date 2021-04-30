const data = require("../../../data.json")
const Recipe = require('../models/Recipe')
const Chef = require("../models/Chef")
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        for (let index = 0; index < chefs.length; index++) { // inserindo src para exibição
            const chef = chefs[index];
            results = await Chef.file(chef.id)
            const file = results.rows[0] 
            file ? chef.src = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` : chef.src = 'http://placehold.it/500x500?text=CHEF SEM FOTO'
        }            

        return res.render("admin/chefs/chefs.njk", {
            chefs, 
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
        
    },
    async show(req, res) {
        const chefId = req.params.id
    
        let results = await Chef.find(chefId)
        const chef = results.rows[0]
        if(!chef) {
            req.flash('error', 'Chef não encontrado.')
            return res.redirect ('/admin/chefs')
        }

        results = await Chef.recipesByChef(chefId)
        const recipes = results.rows

        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            results = await Recipe.recipeFiles(recipe.id)
            const recipeFiles = results.rows //{ id: 1, recipe_id: 12, file_id: 2 } { id: 2, recipe_id: 12, file_id: 3 }
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            })) 
            let files = await Promise.all(filesPromise) // resulta em um array de results que para colher resultado usar map ou forEach
            // results.forEach(results => console.log(results.rows[0]))
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }

        results = await Chef.file(chefId)
        const file = results.rows[0]
        file ? chef.src = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` : chef.src = 'http://placehold.it/500x500?text=CHEF SEM FOTO'
            
        return res.render("admin/chefs/show", {
            chef,
            recipes,
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})  
    },
    async create(req, res) {
        return res.render("admin/chefs/create.njk", {
            chef: req.flash('chef')[0],
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    async edit(req, res) {
        let chefId = req.params.id
        let results = await Chef.find(chefId)
        const chef = results.rows[0]
        if(!chef) {
            req.flash('error', 'Chef não encontrado.')
            return res.redirect ('/admin/chefs')
        }

        results = await Chef.file(chef.id)
        const file = results.rows[0]

        if (file) file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}` 
    
        return res.render("admin/chefs/edit", {
            chef, 
            chefId, 
            file, 
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        //validação de todos os campos preenchidos
        for (const key of keys) {
            if(req.body[key]==""){
                req.flash('error', 'Todos os campos são obrigatorios!')
                return res.redirect('/admin/chefs/create')
            }
        } 

        if(!req.file) {
            req.flash('error', 'Por favor envie uma imagem de avatar.')
            req.flash('chef', req.body)
            return res.redirect('/admin/chefs/create')
        }
    
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        const file = req.file
        await File.avatarFileCreate({...file}, chefId)

        req.flash('success', 'Chef cadastrado com sucesso!')
        return res.redirect('/admin/chefs')
    },
    async put(req, res) {
        const chefId = req.body.chefId
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" ) {
                req.flash('error', 'Por favor preencha todos os campos!')
                return res.redirect(`/admin/chefs/${chefId}/edit`)
            }
        }
        
        if(req.body.removed_files && !req.file){
            req.flash('error', 'Por favor envie um avatar!')
            return res.redirect(`/admin/chefs/${chefId}/edit`)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            removedFiles.pop()
            const fileId = removedFiles[0]
            await File.avatarFileDelete(fileId)
        }
        

        if (req.file) {
            const file = req.file
            await File.avatarFileCreate({...file}, chefId)
        }
        
        await Chef.update(req.body)

        req.flash('success', 'Chef atualizado com sucesso!')
        return res.redirect('/admin/chefs')
    },
    async delete(req, res) {
        const chefId = req.body.chefId
        const total_recipes = req.body.total_recipes
    
        if (total_recipes>0) {
            req.flash('error', 'Chefs que possuem receitas cadastradas não podem ser excluidos!')
            return res.redirect(`admin/chefs/${chefId}/edit`)        
        }

        let results = await Chef.find(chefId)
        const fileId = results.rows[0].file_id

        await Chef.delete(chefId)
        
        await File.avatarFileDelete(fileId)

        req.flash('success', 'Chef deletado com sucesso!')
        return res.redirect('/admin/chefs')
        
    }
}
