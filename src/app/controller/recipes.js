const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const FileRecipe = require('../models/FileRecipe')
const fs = require('fs')
const { date, formatList } = require('../../lib/utils')


module.exports = {
    async index(req, res) {
        const recipes = await Recipe.all()

        for (let index = 0; index < recipes.length; index++) { // inserindo src nas recipes para exibição
            const recipe = recipes[index];
            const recipeFiles = await FileRecipe.findAll({ where: { recipe_id: recipe.id } })
            const filesPromise = recipeFiles.map(recipeFile => ({
                ...recipeFile,
                src: `${req.protocol}://${req.headers.host}${recipeFile.path.replace('public', '')}`
            }))
            const files = await Promise.all(filesPromise)

            if (files[0]) {
                const randomIndex = parseInt(Math.random() * files.length)
                recipe.src = `${req.protocol}://${req.headers.host}${files[randomIndex].path.replace('public', '')}`
            }
        }

        return res.render("admin/recipes/recipes", {
            recipes,
            message: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        })
    },
    async create(req, res) {
        const chefs = await Chef.findAll()
        return res.render("admin/recipes/create", {
            chefs,
            recipe: req.flash('recipe')[0],
            message: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        })
    },
    async show(req, res) {
        const recipeId = req.params.id

        const recipe = await Recipe.find(recipeId)

        if (!recipe) {
            req.flash('error', 'Receita não encontrada.')
            return res.redirect('/admin/recipes')
        }

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        const recipeFiles = await FileRecipe.findAll({ where: { recipe_id: recipe.id } })
        const filesPromise = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}${recipeFile.path.replace('public', '')}`
        }))
        const files = await Promise.all(filesPromise)

        return res.render("admin/recipes/show", {
            recipe,
            files,
            message: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        })
    },
    async edit(req, res) {
        let recipeId = req.params.id

        const recipe = await Recipe.find(recipeId)

        if (!recipe) {
            req.flash('error', 'Receita não encontrada.')
            return res.redirect('/admin/recipes')
        }

        recipe.ingredients = formatList(recipe.ingredients)
        recipe.preparation = formatList(recipe.preparation)

        const chefs = await Chef.findAll()

        const recipeFiles = await FileRecipe.findAll({ where: { recipe_id: recipe.id } })
        const filesPromise = recipeFiles.map(recipeFile => ({
            ...recipeFile,
            src: `${req.protocol}://${req.headers.host}${recipeFile.path.replace('public', '')}`
        }))
        const files = await Promise.all(filesPromise)

        return res.render("admin/recipes/edit", {
            recipe,
            recipeId,
            chefs,
            files,
            message: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        })
    },
    async post(req, res) {
        const user_id = req.session.userId
        const {
            chef_id,
            title,
            ingredients,
            preparation,
            information
        } = req.body


        const formatedIngredients = ingredients.join("##")
        const formatedPreparation = preparation.join("##")

        const recipe_id = await Recipe.create({
            chef_id,
            title,
            ingredients: formatedIngredients,
            preparation: formatedPreparation,
            information,
            created_at: date(Date.now()).iso,
            updated_at: date(Date.now()).iso,
            user_id
        })

        const filesPromise = req.files.map(file => FileRecipe.create({
            name: file.filename,
            path: file.path,
            recipe_id
        })) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia

        req.flash('success', 'Receita criada com sucesso.')
        return res.redirect('/admin/recipes')
    },
    async put(req, res) {
        const recipe_id = req.body.recipeId

        if (req.files.length != 0) {
            const newFilesPromisse = req.files.map(file => FileRecipe.create({
                name: file.filename,
                path: file.path,
                recipe_id
            }))
            await Promise.all(newFilesPromisse)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            removedFiles.pop()

            const unlinkPromise = removedFiles.map(async id => {
                const file = await FileRecipe.findOne({ where: { id } })
                return fs.unlinkSync(file.path)
            })
            await Promise.all(unlinkPromise)

            const removedFilesPromise = removedFiles.map(id => FileRecipe.delete(id))
            await Promise.all(removedFilesPromise)
        }

        const {
            chef_id,
            title,
            ingredients,
            preparation,
            information
        } = req.body

        const formatedIngredients = ingredients.join("##")
        const formatedPreparation = preparation.join("##")


        await Recipe.update(recipe_id, {
            chef_id,
            title,
            ingredients: formatedIngredients,
            preparation: formatedPreparation,
            information
        })

        req.flash('success', 'Receita atualizada com sucesso.')
        return res.redirect(`/admin/recipes/${recipe_id}`)
    },
    async delete(req, res) {
        const recipe_id = req.body.recipeId

        const recipeFiles = await FileRecipe.findAll({ where: { recipe_id } })

        const unlinkPromise = recipeFiles.map(async file => {
            const recipeFile = await FileRecipe.findOne({ where: { id: file.id } })
            return fs.unlinkSync(recipeFile.path)
        })
        await Promise.all(unlinkPromise)

        const filesPromise = recipeFiles.map(file => FileRecipe.delete(file.id)) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia

        await Recipe.delete(recipe_id)

        req.flash('success', 'Receita excluída com sucesso.')
        return res.redirect('recipes')
    }
}
