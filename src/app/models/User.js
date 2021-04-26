const db = require('../../config/db')

module.exports = {
    all(){
        try {
            const query = `
            SELECT *
            FROM users 
            ORDER BY id ASC
            `
            return db.query(query)
        } catch (error) {
            console.log(error)
        }
            
    },
    create(data){
        try {
            return db.query(`
                INSERT INTO users(
                    name,
                    email,
                    password,
                    is_Admin
                ) VALUES (
                    '${data.name}', 
                    '${data.email}', 
                    '${data.password}', 
                    '${data.is_Admin}')
                RETURNING id
                `)
        } catch (error) {
            console.log(error)
        }
        
    },
    findOne(filters){
        try {
            let query = `SELECT * FROM users`
            //Query Dinamica
            Object.keys(filters).map(key => {
                // where || or
                query = `${query}
                ${key}
                `
    
                Object.keys(filters[key]).map(field => {
                    // email || cpf_cnpj
                    query = `${query} ${field} = '${filters[key][field]}'`
                })
            })
            return db.query(query)
        } catch (error) {
            console.log(error)
        }
        
    },
    find(id){
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `
            return db.query(query,[id])
        } catch (error) {
            console.log(error)
        }
        
    },
    update(data){
        try {
            const query = `
            UPDATE chefs SET 
                name=($1)
            WHERE id=($2)
            `
            const values = [
                data.name,
                data.chefId
            ]

            return db.query(query, values)
        } catch (error) {
            console.log(error)
        }
        
    },
    delete(id){
        try {
            const query = `
            DELETE FROM chefs WHERE id = $1
            `
            return db.query(query,[id])
        } catch (error) {
            console.log(error)
        }
        
    },
    recipesByChef(id){
        try {
            const query=`
            SELECT recipes.title, recipes.id, 
            chefs.name AS chef_name 
            FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = ${id}
            `
            return db.query(query)
        } catch (error) {
            console.log(error)
        }
        
    },
    file(id){
        try {
            return db.query(`
            SELECT * FROM files WHERE id = $1
            `, [id])
        } catch (error) {
            console.log(error)
        }
       
    }
}