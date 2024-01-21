const express = require('express')
const router = express.Router()
const {createUser, findAllUsers, findUserByPk, updateUser, deleteUser} =require('../controllers/userControllers')
const { login, protect, correctUser, restrictToOwnUser } = require('../controllers/authControllers')
const { User } = require('../db/sequelizeSetup')


router
    .route('/')
    .get(findAllUsers)
    .post(createUser)

router
    .route('/login')
    .post(login)

router
    .route('/:id')
    .get(findUserByPk)
    .put(protect, correctUser, updateUser)
    .delete(protect, restrictToOwnUser(User), deleteUser)





module.exports = router