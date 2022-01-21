const faker = require('faker')
const { hash } = require('bcryptjs')
const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const FileChef = require('./src/app/models/FileChef')
const Recipe = require('./src/app/models/Recipe')
const FileRecipe = require('./src/app/models/FileRecipe')
const { date } = require('./src/lib/utils')



async function createUsers() {
    const users = []
    const password = await hash('1111', 8)
    let usersIds = []


    while (users.length < 3) {
        let is_admin = Math.floor(Math.random() * 2)
        is_admin = 0 ? true : false
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            is_admin
        })
    }
    const usersPromise = users.map(user => User.create(user))
    return usersIds = await Promise.all(usersPromise)
}
async function createChefs() {
    const chefs = []
    let chefsIds = []


    while (chefs.length < 6) {
        chefs.push({
            name: faker.name.findName(),
            created_at: date(Date.now()).iso
        })
    }
    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)

    // for (const id of chefsIds) {
    //     await FileChef.create({
    //         name:faker.image.image(), 
    //         path:`public/images/placeholder.png`, 
    //         chef_id:id})
    // }

    return chefsIds
}

async function createRecipes(usersIds, chefsIds) {
    const recipes = []
    let recipesIds = []
    let filesIds = []

    while (recipes.length < 6) {
        recipes.push({
            title: faker.lorem.word(),
            ingredients: faker.lorem.words(4),
            preparation: faker.lorem.sentence(3),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 3)),
            user_id: usersIds[Math.floor(Math.random() * usersIds.length)],
            chef_id: chefsIds[Math.floor(Math.random() * chefsIds.length)]
        })
    }
    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

    // let files = []
    // while (files.length < 25) {
    //     files.push({
    //         name:faker.image.image(),
    //         path:`public/images/placeholder.png`,
    //         recipe_id: recipesIds[Math.floor(Math.random() * recipesIds.length)],
    //     })
    // }
    // const filesPromise = files.map(file => FileRecipe.create(file))
    // filesIds = await Promise.all(filesPromise)

}

async function init() {
    const usersIds = await createUsers()
    const chefsIds = await createChefs()
    await createRecipes(usersIds, chefsIds)
}
init()