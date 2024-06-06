const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Users = require("../model/usersModel");
const Queries = require("../model/queriesModel");

router.post('/savequeries', asyncHandler(async (req, res) => {
    const {userId,query} = req.body;

   

    const userExists = await Users.findOne({_id: userId});
   

    if(!userId) {
        res.status(400).json({"error": "userId is required"});
    } else if(!userExists) {
        res.status(400).json({"error": "There is not user with the userId that you provided"});
    } else if(!query){
        res.status(400).json({"error": "There is no query"});
    }
        
    if(query) {
        const queries = await Queries.create({
            userId: userId,
            query: query,
            search

        });

        if(queries) {
            res.status(201).json({
                "_id": queries._id,
                "userId": queries.userId,
                "query":queries.query,
                
            });
        } else {
            res.status(400).json({"error": "There is a problem with your save request"});
        }   
    }
        
    }
));

module.exports = router