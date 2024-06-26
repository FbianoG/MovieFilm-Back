const { User } = require('../models/model')
const { hashPassword, comparePassword } = require('../middlewares/bcrypt')
const { createToken, verifyToken } = require('../middlewares/jwtoken')




async function home(req, res) {
    return res.status(200).json({ message: "Olá,Mundo" })
}

async function createUser(req, res) {
    let { email, password, date, name } = req.body
    email = email.toLowerCase()
    name = name.toLowerCase()
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
    let { email, password } = req.body
    email = email.toLowerCase()
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
        if (!getUser) {
            return res.status(400).json({ message: "Usuário não encontrado." })
        }
        return res.status(200).json(getUser)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro interno de servido!' })
    }
}

async function getAllUser(req, res) {
    const _id = req.userId
    try {
        if (!_id) {
            return res.status(400).json({ message: 'É necessário fazer login.' })
        }
        const getAllUser = await User.find({}, '-password -date')
        if (!getAllUser) {
            return res.status(400).json({ message: "Usuário não encontrado." })
        }
        return res.status(200).json(getAllUser)
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
        const icludeMovie = await User.findByIdAndUpdate({ _id }, { like: [movie, ...getUser.like] })
        return res.status(200).json({ message: "Filme incluído na lista de favoritos!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno de servidor!" })
    }
}

async function includeWatch(req, res) {
    const { movie } = req.body
    // console.log(movie);
    // return
    const _id = req.userId
    try {
        if (!_id) {
            return res.status(400).json({ message: 'É necessário fazer login.' })
        }
        const getUser = await User.findById({ _id })
        if (!getUser) {
            return res.status(400).json({ message: 'Usuário não encontrado!' })
        }
        const duplicateMovie = getUser.watch.some(element => element.id === movie.id)
        if (duplicateMovie) {
            const newWatch = getUser.watch.filter(element => element.id !== movie.id)
            const includeMovie = await User.findByIdAndUpdate({ _id }, { watch: newWatch })
            return res.status(200).json({ message: 'Filme removido da lista "Assistir Depois"!' })
        }
        const includeMovie = await User.findByIdAndUpdate({ _id }, { watch: [...getUser.watch, movie] })
        return res.status(200).json({ message: "Filme incluído na lista 'Assistir Depois'!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno de servidor!" })
    }
}

async function getCompareMovies(req, res) {
    let { email } = req.body
    email = email.toLowerCase()
    const _id = req.userId
    try {
        if (!_id) {
            return res.status(400).json({ message: 'É necessário fazer login.' })
        }
        const getUser = await User.findById({ _id }, '-password -date')
        const getUser2 = await User.findOne({ email }, '-password -date')
        if (!getUser || !getUser2) {
            return res.status(400).json({ message: 'Usuário não encontrado' })
        }
        // console.log(getUser);
        return res.status(200).json({ user1: getUser, user2: getUser2 })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro interno de servidor!" })
    }
}


module.exports = { home, createUser, login, getUser, includeFavorite, getCompareMovies, includeWatch, getAllUser }