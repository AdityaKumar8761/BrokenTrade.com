const express = require('express');
const router = express.Router();

const User = require('../modules/user');

router.post('/' , async (req, res) => {
    try{
        const data = req.body // Assuming the request body contains the person data
        
        //Create a new Person document using the Mongoose model
        const newUser = new User(data);

        //Save the new person to the databse
        const response = await newUser.save();
        console.log('data saved');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;

