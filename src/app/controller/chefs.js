const data = require("../../../data.json")
const Recipe = require('../models/Recipe')
const Chef = require("../models/Chef")
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows
        return res.render("admin/chefs/chefs.njk", {chefs})
        
    },
    async show(req, res) {
        let chefId = req.params.id
    
        let results = await Chef.find(chefId)
        const chef = results.rows[0]
        if(!chef) return res.send ('Chef não encontrado!')
        chef.avatar_url = chef.avatar_url.replace("https://", "")

        results = await Chef.recipesByChef(chefId)
        const recipes = results.rows

        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            results = await Recipe.recipeFiles(recipe.id)
            const recipeFiles = results.rows //{ id: 1, recipe_id: 12, file_id: 2 } { id: 2, recipe_id: 12, file_id: 3 }
            const filesPromise = recipeFiles.map( recipeFile => Recipe.files(recipeFile.file_id)) 
            results = await Promise.all(filesPromise) // resulta em um array de results que para colher resultado usar map ou forEach
            // results.forEach(results => console.log(results.rows[0]))
            let files = results.map(results=>results.rows[0])
            if(files[0]) {
                let randomIndex = parseInt(Math.random() * files.length) 
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public','')}`
            }            
        }
        return res.render("admin/chefs/show", {chef, recipes})  
    },
    async create(req, res) {
        return res.render("admin/chefs/create.njk")
    },
    async edit(req, res) {
        let chefId = req.params.id
        let results = await Chef.find(chefId)
        const chef = results.rows[0]
        if(!chef) return res.send ('Chef não encontrado!')
    
        return res.render("admin/chefs/edit", {chef, chefId})
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        //validação de todos os campos preenchidos
        keys.forEach(key => {
            if(req.body[key]==""){
                return res.send("Todos os campos são obrigatorios")
            }
        });
        if(!req.file) return res.send('Por favor envie uma imagem de avatar.')
    
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        const file = req.file
        await File.avatarFileCreate({...file}, chefId)
        
        return res.redirect('/admin/chefs')
    },
    async put(req, res) {
        await Chef.update(req.body)

        return res.redirect('/admin/chefs')
    },
    async delete(req, res) {
        const chefId = req.body.chefId
        const total_recipes = req.body.total_recipes
    
        if (total_recipes>0) return res.send("Erro! Chefs que possuem receitas cadastradas não podem ser excluidos!")
        
        await Chef.delete(chefId)

        return res.redirect('/admin/chefs')
        
    }
}
