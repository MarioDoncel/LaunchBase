const Base = require('./Base')

Base.init({table: 'recipe_files'})

const FileRecipe = {
    ...Base
}

module.exports = FileRecipe