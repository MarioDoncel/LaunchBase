const data = require("../data.json")
const fs = require("fs")

exports.index = function(req, res) {
    return res.render("admin/recipes.njk", {recipes : data.recipes})
}

exports.create = function(req, res) {
    return res.render("admin/create.njk")
}

exports.show = function(req, res) {
    let recipeIndex = req.params.id;
    const foundRecipe = data.recipes[recipeIndex]
    if (!foundRecipe) {
        return res.send("Receita não encontrada!")
    }
    return res.render("admin/show.njk", {recipe : foundRecipe})
}


exports.edit = function(req, res) {
    let recipeIndex = req.params.id;
    const foundRecipe = data.recipes[recipeIndex]
    if (!foundRecipe) {
        return res.send("Receita não encontrada!")
    }
    return res.render("admin/edit.njk", {recipe : foundRecipe, index : recipeIndex})
}



exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    //validação de todos os campos preenchidos
    keys.forEach(key => {
        if(req.body[key]==""){
            return res.send("Todos os campos são obrigatorios")
        }
    });

    let {image,title,author,ingredients , preparation, information} = req.body

    data.recipes.push({
        image,
        title,
        author,
        ingredients ,
        preparation,
        information
    })

    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
        if (err) {
            return res.send("Write file error!")
        }
        return res.redirect('/admin/recipes')
    })
}

exports.put = function(req, res) {
    const index = req.body.index
    let {image,title,author,ingredients , preparation, information} = req.body

    data.recipes[index] = {
        image,
        title,
        author,
        ingredients ,
        preparation,
        information
    }
    

    fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
        if (err) {
            return res.send("Write file error!")
        }
    return res.redirect('/admin/recipes')
})
}

exports.delete = function(req, res) {
    const index = req.body.index
    
    data.recipes.splice(index, 1)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
        if (err) {
            return res.send("Write file error!")
        }
    return res.redirect('/admin/recipes')
})
}