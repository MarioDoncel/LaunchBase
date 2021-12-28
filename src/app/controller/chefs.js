const Recipe = require('../models/Recipe')
const FileRecipe = require('../models/FileRecipe')
const Chef = require("../models/Chef")
const FileChef = require('../models/FileChef')
const fs = require('fs')
const {date} = require('../../lib/utils')

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
        const chef_id = req.params.id
        const chef = await Chef.find(chef_id)
    
        if(!chef) {
            req.flash('error', 'Chef não encontrado.')
            return res.redirect ('/admin/chefs')
        }

        const recipes = await Recipe.findAll({where: {chef_id}})

        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            const recipeFiles = await FileRecipe.findAll({where: {recipe_id:recipe.id}})
            const filesPromise = recipeFiles.map( recipeFile => ({
                ...recipeFile,
                src:`${req.protocol}://${req.headers.host}${recipeFile.path.replace('public','')}`
            }))  
            const files = await Promise.all(filesPromise) 
            
            if(files[0]) {
                const randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = files[randomIndex].name.includes('http') ? `${files[randomIndex].name}` : `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
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
            chefId:chef_id, 
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
        await FileChef.create({name:filename, path, chef_id})

        req.flash('success', 'Chef cadastrado com sucesso!')
        return res.redirect('/admin/chefs')
    },
    async put(req, res) {
        const chef_id = req.body.chefId
        
        if(req.body.removed_files){
            try {
                const file = await FileChef.findOne({where:{chef_id}})
                fs.unlinkSync(file.path)
                await FileChef.delete(file.id)
             
               
            } catch (err) {
                console.error(err)
            }
        }
        
        if (req.file) {
            const file = req.file
            const { filename, path } = file
            await FileChef.create({name:filename, path, chef_id})
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

        const file = await FileChef.findOne({where:{chef_id}})
        if(file){
            fs.unlinkSync(file.path)
            await FileChef.delete(file.id)
        }
        
        await Chef.delete(chef_id)
        
        req.flash('success', 'Chef deletado com sucesso!')
        return res.redirect('/admin/chefs')
    }
}
