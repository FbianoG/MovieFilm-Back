const router = require('express').Router()
const control = require('../controllers/controller')
const jwt = require('../middlewares/jwtoken')

router.get('/', control.home)

router.post('/createUser', control.createUser)
router.post('/login', control.login)
router.post('/getUser', jwt.verifyToken, control.getUser)
router.post('/includeFavorite', jwt.verifyToken, control.includeFavorite)
router.post('/getCompareMovies', jwt.verifyToken, control.getCompareMovies)
router.post('/includeWatch', jwt.verifyToken, control.includeWatch)



module.exports = router