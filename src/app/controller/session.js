const crypto = require('crypto') // modulo de criação de token no NODE
const mailer = require('../../lib/mailer')
const {hash} = require('bcryptjs')


const User = require('../models/User')


module.exports = {
    loginForm(req, res){
        return res.render('admin/session/login',{
            user: req.flash('user')[0],
            errorPassword: req.flash('errorPassword')[0],
            errorEmail: req.flash('errorEmail')[0],
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    login(req,res){
        //Initialize req.session
        req.session.userId = req.user.id
        req.flash('success', "Login efetuado.")
        return res.redirect('/admin/user')
    },
    logout(req, res){
        req.session.destroy()
        return res.redirect('/')
    },
    forgotForm(req, res){
        return res.render('admin/session/forgot-password',{
            user: req.flash('user')[0],
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    async forgot(req,res){
        const user = req.user // vem do validator

        try {
             // criar token
            const token = crypto.randomBytes(20).toString('hex')
            //ciar  validade do token
            const now = new Date()
            const expires = now.setHours(now.getHours()+1)
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: expires
            })
            // enviar email com link de recuperação de senha (token)
            await mailer.sendMail({
                to:user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a senha?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/admin/user/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })
            //avisar o usuario que enviamos o email
            req.flash('success', "Email enviado, verifique sua caixa de entrada para resetar sua senha.")
            return res.redirect("/admin/user/login")

        } catch (error) {

            req.flash('error', "Ocorreu um erro, tente novamente.")
            return res.redirect("/admin/user/forgot-password")
        }
       
    },
    resetForm(req, res){
        return res.render('admin/session/password-reset', {
            token: req.query.token,
            message:{
                error: req.flash('error'),
                success: req.flash('success')
        }})
    },
    async reset(req,res){
        const {password} = req.body
        const user = req.user
        try {
            // Cria um novo hash de senha
            const passwordHash = await hash(password, 8)
            // Atualiza o usuário
            await User.update(user.id,{
                password: passwordHash,
                reset_token: "",
                reset_token_expires:""
            })
            // Avisa o usúario que ele tem uma nova senha
            req.flash('success', "Senha atualizada! Faça o seu login.")
            return res.redirect("/admin/user/login")
        } catch (error) {
            console.error(error)
            req.flash('error', "Ocorreu um erro, tente novamente.")
            return res.redirect(`/admin/user/password-reset?token=${req.query.token}`)
        }
        
    }

}