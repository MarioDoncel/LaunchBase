

module.exports = {
    async index(req, res) {
        
        return res.render("admin/users/profile.njk")
        
    },
    async put(req, res) {
        
        return res.render("/")
        
    },
}