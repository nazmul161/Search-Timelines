// Handling requests related to Users colletion

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Users = require("../model/usersModel");

// This route is for login which evaluates the user credential and returns the user information if they entered their username and password correctly.
router.post('/login', asyncHandler(async (req, res) => {
    const {username, password, email} = req.body;

    var user = await Users.findOne({username});

    if(!username) {
        res.status(400).json({"error": "Username/Email is required"});
    } else if(!password) {
        res.status(400).json({"error": "Password is required"});
    }
    
    if(!user && !email) {
        user = await Users.findOne({email: username});
    }

    if(user && (password==user.password)) {
        res.status(201).json({
            "_id": user._id,
            "username": user.username,
            "email": user.email
        });
    }
    else
    {
        res.status(400).json({"error": "Invalid credentials"});
    }
}));

// This route is for signup which evaluates a user input data and saves their information in the users collection if there was not any errors.
router.post('/signup', asyncHandler(async (req, res) => {
    const {username, password, repassword, email} = req.body;

    const userExists = await Users.findOne({username});

    if(!username) {
        res.status(400).json({"error": "Username is required"});
    } else if(!password) {
        res.status(400).json({"error": "Password is required"});
    } else if(!repassword) {
        res.status(400).json({"error": "Password Confirmation is required"});
    } else if(password!=repassword) {
        res.status(400).json({"error": "Password and Password Confirmation do not match."});
    } else if(userExists) {
        res.status(400).json({"error": "Username already exists. Try another one"});
    } else {
        
        const user = await Users.create({
            username: username,
            password: password,
            email: email
        });

        if(user) {
            res.status(201).json({
                "_id": user._id,
                "username": user.username,
                "email": user.email
            });
        } else {
            res.status(400).json({"error": "There is a problem with your sign up request"});
        }
        
    }
}));

router.post('/signuplogin', asyncHandler(async (req, res) => {
    const {username} = req.body;

    const userExists = await Users.findOne({username});

    if(!username) {
        res.status(400).json({"error": "Username is required"});
    } else {
        if(userExists) {
            res.status(201).json({
                "_id": userExists._id,
                "username": userExists.username,
                "email": userExists.email
            });
        } else {

            const user = await Users.create({
                username: username,
                password: '123456' // default password is 123456
            });

            if(user) {
                res.status(201).json({
                    "_id": user._id,
                    "username": user.username,
                    "email": user.email
                });
            } else {
                res.status(400).json({"error": "There is a problem with your SignUp/LogIn request"});
            }

        }
    }
}));


module.exports = router