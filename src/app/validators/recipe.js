const {checkAllFields} = require('../../lib/utils')


async function post(req, res, next) {
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('recipe', fillAllFields.user)
        req.flash('error', fillAllFields.error)
        return res.redirect('/admin/recipes/create')
    }
    // Validação de imagens enviadas
    if(req.files.length == 0) {
        req.flash('error', 'Por favor envie uma imagem de avatar.')
        req.flash('recipe', req.body)
        return res.redirect('/admin/recipes/create')
    }

    next()
}
async function update(req, res, next) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files" ) {
            req.flash('error', 'Por favor preencha todos os campos.')
            return res.redirect(`/admin/recipes/${recipeId}/edit`)
        }
    }
    
    next()
}

module.exports = {
    post,
    update
}





