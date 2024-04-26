const { User } = require('../models/model')
const { hashPassword, comparePassword } = require('../middlewares/bcrypt')
const { createToken, verifyToken } = require('../middlewares/jwtoken')




async function home(req, res) {
    return res.status(200).json({ message: "Olá,Mundo" })
}

async function createUser(req, res) {
    const { email, password, date, name } = req.body
    try {
        if (!email || !password || !date || !name) {
            return res.status(400).json({ message: "Preencha todos os campos!" })
        }
        const verifyEmail = await User.findOne({ email })
        if (verifyEmail) {
            return res.status(400).json({ message: "Email já está sendo utilizado!" })
        }
        const hashedPassword = await hashPassword(password)
        const createUser = await User.create({ email, password: hashedPassword, date, name })
        return res.status(201).json({ message: "Usuário criado com sucesso!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno de servidor!" })
    }
}

async function login(req, res) {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Preencha todos os campos!" })
        }
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.status(400).json({ message: "Login ou senha inválidos!" })
        }
        const varifyPassword = await comparePassword(password, findUser.password)
        if (!varifyPassword) {
            return res.status(400).json({ message: "Login ou senha inválidos!" })
        }
        const token = await createToken(findUser._id)
        return res.status(200).json({ message: "Logado com sucesso!", token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Erro interno de servidor!' })
    }
}

async function getUser(req, res) {
    const _id = req.userId
    try {
        if (!_id) {
            return res.status(400).json({ message: 'É necessário fazer login.' })
        }
        const getUser = await User.findById({ _id }, '-password -date')
        return res.status(200).json(getUser)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servido!' })
    }
}

async function includeFavorite(req, res) {
    const { movie } = req.body
    const _id = req.userId
    try {
        if (!_id) {
            return res.status(400).json({ message: 'É necessário fazer login.' })
        }
        const getUser = await User.findById({ _id })
        if (!getUser) {
            return res.status(400).json({ message: 'Usuário não encontrado!' })
        }
        const duplicateMovie = getUser.like.some(element => element.id === movie.id)
        if (duplicateMovie) {
            const newLike = getUser.like.filter(element => element.id !== movie.id)
            // console.log(newLike);
            const icludeMovie = await User.findByIdAndUpdate({ _id }, { like: newLike })
            return res.status(200).json({ message: 'Filme removido da lista de favoritos!' })
        }
        const icludeMovie = await User.findByIdAndUpdate({ _id }, { like: [...getUser.like, movie] })
        return res.status(200).json({ message: "Filme incluído na lista de favoritos!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno de servidor!" })
    }
}



module.exports = { home, createUser, login, getUser, includeFavorite }