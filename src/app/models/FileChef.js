const Base = require('./Base')

Base.init({table: 'chef_files'})

const FileChef = {
    ...Base
}


module.exports = FileChef