const express = require('express');
const userController = require('./../Controller/userController');
const router = express.Router();

//USER ROUTES

router.route('/')
.get(userController.getAllUsers)
.post(userController.addUser);

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;