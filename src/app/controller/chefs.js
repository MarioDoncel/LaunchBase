const Recipe = require('../models/Recipe')
const Chef = require("../models/Chef")
const FileChef = require('../models/FileChef')
const {date, filesWithSrc, randomFile} = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        const chefs = await Chef.all()

        for (let index = 0; index < chefs.length; index++) { // inserindo src para exibição
            const chef = chefs[index];
            const file = await FileChef.findOne({where : {chef_id:chef.id}})
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
        const chef_Id = req.params.id
    
        const chef = await Chef.find(chef_Id)
    
        if(!chef) {
            req.flash('error', 'Chef não encontrado.')
            return res.redirect ('/admin/chefs')
        }

        const recipes = await Recipe.findAll({where: {chef_id}})

        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            const files = await filesWithSrc(recipe)
            // const recipeFiles = await FileRecipe.findAll({where: {id:recipe.id}})
            // const filesPromise = recipeFiles.map( recipeFile => ({
            //     ...recipeFile,
            //     src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            // }))  
            // const files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                randomFile(recipe, files)
            }            
        }

        const file = await FileChef.findOne({where: {chef_id}})
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
        const chef_id = req.params.id
        const chef = await Chef.find(chef_id)
        if(!chef) {
            req.flash('error', 'Chef não encontrado.')
            return res.redirect ('/admin/chefs')
        }

        const file = await FileChef.findOne({where: {chef_id}})

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
        const { name } = req.body
        const created_at = date(Date.now()).iso
        const chef_id = await Chef.create({name, created_at})
        

        const file = req.file
        const { filename, path } = file
        await FileChef.create({filename, path, chef_id})

        req.flash('success', 'Chef cadastrado com sucesso!')
        return res.redirect('/admin/chefs')
    },
    async put(req, res) {
        const chef_id = req.body.chefId
        // const keys = Object.keys(req.body)
        // for (key of keys) {
        //     if (req.body[key] == "" && key != "removed_files" ) {
        //         req.flash('error', 'Por favor preencha todos os campos!')
        //         return res.redirect(`/admin/chefs/${chef_id}/edit`)
        //     }
        // }
        
        // if(req.body.removed_files && !req.file){
        //     req.flash('error', 'Por favor envie um avatar!')
        //     return res.redirect(`/admin/chefs/${chef_id}/edit`)
        // }

        if(req.body.removed_files){
            try {
                const file = await FileChef.find({where:{chef_id}})
                fs.unlinkSync(file.path)
            } catch (err) {
                console.error(err)
            }
            await FileChef.delete(chef_id)
        }
        
        if (req.file) {
            const file = req.file
            const { filename, path } = file
            await FileChef.create({filename, path, chef_id})
        }
        
        const { name } = req.body
        await Chef.update( chef_id, {name})

        req.flash('success', 'Chef atualizado com sucesso!')
        return res.redirect('/admin/chefs')
    },
    async delete(req, res) {
        const chef_id = req.body.chefId
        const total_recipes = req.body.total_recipes
    
        if (total_recipes>0) {
            req.flash('error', 'Chefs que possuem receitas cadastradas não podem ser excluidos!')
            return res.redirect(`admin/chefs/${chef_id}/edit`)        
        }

        const file = await FileChef.find({where:{chef_id}})
        fs.unlinkSync(file.path)
        await FileChef.delete(chef_id)
        
        await Chef.delete(chef_id)
        
        req.flash('success', 'Chef deletado com sucesso!')
        return res.redirect('/admin/chefs')
    }
}
