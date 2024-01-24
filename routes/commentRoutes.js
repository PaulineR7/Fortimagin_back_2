const express = require('express')
const router = express.Router()
const {Comment} = require('../db/sequelizeSetup')
const { createComment, findAllComments, updateComment, deleteComment }=require('../controllers/commentControllers')
const { protect, restrictToOwnUser } = require('../controllers/authControllers')


router
    .route('/')
    .get(findAllComments)
    .post(protect, createComment)

router
    .route('/:id')
    .post(protect, createComment)
    .put(protect, restrictToOwnUser(Comment), updateComment)
    .delete(protect, restrictToOwnUser(Comment), deleteComment)


module.exports= router