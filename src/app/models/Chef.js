const db = require('../../config/db')
const Base = require('./Base')


Base.init({table: 'chefs'})

const Chef =  { 
    ...Base,
    all(){
        try {
            const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.name ASC
            `
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
            SELECT * FROM chef_files WHERE chef_id = $1
            `, [id])
        } catch (error) {
            console.log(error)
        }
       
    }
}



module.exports = Chef
const {date}= require('../../lib/utils')


// module.exports = {
//     all(){
//         try {
//             const query = `
//             SELECT chefs.*, count(recipes) AS total_recipes
//             FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
//             GROUP BY chefs.id
//             ORDER BY chefs.name ASC
//             `
//             return db.query(query)
//         } catch (error) {
//             console.log(error)
//         }
            
//     },
//     create(data){
//         try {
//             const query=`
//             INSERT INTO chefs (
//                 name,
//                 created_at
//             ) VALUES ($1,$2)
//             RETURNING id
//             `
//             const values = [
//                 data.name,
//                 date(Date.now()).iso
//             ]

//             return db.query(query, values)
//         } catch (error) {
//             console.log(error)
//         }
        
//     },
    // find(id){
    //     try {
    //         const query = `
    //         SELECT chefs.*, count(recipes) AS total_recipes
    //         FROM chefs LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
    //         WHERE chefs.id = $1
    //         GROUP BY chefs.id
    //         `
    //         return db.query(query,[id])
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // },
    // update(data){
    //     try {
    //         const query = `
    //         UPDATE chefs SET 
    //             name=($1)
    //         WHERE id=($2)
    //         `
    //         const values = [
    //             data.name,
    //             data.chefId
    //         ]

    //         return db.query(query, values)
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // },
    // delete(id){
    //     try {
    //         const query = `
    //         DELETE FROM chefs WHERE id = $1
    //         `
    //         return db.query(query,[id])
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // },
//     recipesByChef(id){
//         try {
//             const query=`
//             SELECT recipes.title, recipes.id, 
//             chefs.name AS chef_name 
//             FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
//             WHERE chefs.id = ${id}
//             `
//             return db.query(query)
//         } catch (error) {
//             console.log(error)
//         }
        
//     },
//     file(id){
//         try {
//             return db.query(`
//             SELECT * FROM chef_files WHERE chef_id = $1
//             `, [id])
//         } catch (error) {
//             console.log(error)
//         }
       
//     }
// }