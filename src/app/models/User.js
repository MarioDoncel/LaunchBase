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
    update(data){
        try {
            const query = `
            UPDATE users SET 
                name=($1),
                email=($2),
                is_admin=($3)
            WHERE id=($4)
            `
            const values = [
                data.name,
                data.email,
                data.is_admin,
                data.userId
            ]

            return db.query(query, values)
        } catch (error) {
            console.log(error)
        }
        
    },
    profileUpdate(data){
        try {
            const query = `
            UPDATE users SET 
                name=($1),
                email=($2)
            WHERE id=($3)
            `
            const values = [
                data.name,
                data.email,
                data.id
            ]

            return db.query(query, values)
        } catch (error) {
            console.log(error)
        }
        
    },
    delete(id){
        try {
            const query = `
            DELETE FROM users WHERE id = $1
            `
            return db.query(query,[id])
        } catch (error) {
            console.log(error)
        }
        
    }
        
}