const faker = require('faker')
const {hash} = require('bcryptjs')
const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const FileChef = require('./src/app/models/FileChef')
const Recipe = require('./src/app/models/Recipe')
const FileRecipe = require('./src/app/models/FileRecipe')


async function createUsers() {
    const users = []
    const password = await hash('1111', 8)
    let usersIds = []


    while (users.length < 3) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            is_admin: Math.floor(Math.random * 2) = 0 ? true : false
        })
    }
    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}
async function createChefs() {
    const chefs = []
    let chefsIds = []


    while (chefs.length < 6) {
        chefs.push({
            name: faker.name.findName(),
        })
    }
    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)

    for (const id of chefsIds) {
        await FileChef.create({
            name:faker.lorem.word(), 
            path:`public/images/placeholder.png`, 
            chef_id:id})
    }
}

async function createRecipes() {
    const recipes = []
    let recipesIds = []
    let filesIds = []

    while (recipes.length < 10) {
        let ingredients = []
        const random = Math.ceil(Math.random * 3)
        for (let index = 1; index <= random; index++) {
            ingredients.push(faker.lorem.word())
        }

        let preparation = []
        const random = Math.ceil(Math.random * 3)
        for (let index = 1; index <= random; index++) {
            preparation.push(faker.lorem.sentence(3))
        }

        recipes.push({
            title:	faker.lorem.word(),
            ingredients,
            preparation,
            information: faker.lorem.paragraph(Math.ceil(Math.random()*3)),
            user_id: Math.ceil(Math.random * 3),
            chef_id: Math.ceil(Math.random * 6)
        })
    }
    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

    let files = []
    while (files.length < 25) {
        files.push({
            name:faker.image.image(),
            path:`public/images/placeholder.png`,
            recipe_id: Math.ceil(Math.random()*10),
        })
    }
    const filesPromise = files.map(file => FileRecipe.create(file))
    filesIds = await Promise.all(filesPromise)

}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}
init()