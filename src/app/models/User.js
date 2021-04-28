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
                    is_admin
                ) VALUES (
                    '${data.name}', 
                    '${data.email}', 
                    '${data.password}', 
                    '${data.is_admin}')
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
    async update(id, fields){
        try {
            let query = `UPDATE users SET`
            Object.keys(fields).map((key, index, array)=> {
                if((index+1) < array.length) {
                    query = `${query}
                    ${key} = '${fields[key]}',
                    `
                } else {
                    //last iteration ... no comma
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                    `
                }
            })
            await db.query(query)
            return

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