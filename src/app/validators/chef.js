const {checkAllFields} = require('../../lib/utils')


async function post(req, res, next) {        
    //check fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields){
        req.flash('error', fillAllFields.error)
        return res.redirect('/admin/chefs/create')
    }
    // Validação de imagens enviadas
    if(!req.file) {
        req.flash('error', 'Por favor envie uma imagem de avatar.')
        req.flash('chef', req.body)
        return res.redirect('/admin/chefs/create')
    }

    next()
}
async function update(req, res, next) {
    const chef_id = req.body.chefId
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files" ) {
            req.flash('error', 'Por favor preencha todos os campos!')
            return res.redirect(`/admin/chefs/${chef_id}/edit`)
        }
    }
    if(req.body.removed_files && !req.file){
        req.flash('error', 'Por favor envie um avatar!')
        return res.redirect(`/admin/chefs/${chef_id}/edit`)
    }
    next()
}

module.exports = {
    post,
    update
}





