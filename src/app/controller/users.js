

module.exports = {
    async list(req, res) {
        
        return res.render("admin/users/users")
        
    },
    async post(req, res) {
        
        return res.render("/")
        
    },
    async create(req, res) {
        
        return res.render("admin/users/create")
        
    },
    async put(req, res) {
        
        return res.render("/")
        
    },
    async edit(req, res) {
        
        return res.render("admin/users/edit")
        
    },
    async delete(req, res) {
        
        return res.render("/")
        
    },
}