const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check,validationResult} = require('express-validator');

// @route Get api/auth

router.get('/',auth,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');// return user information except password
        res.json(user)
    } catch (error) {
        res.status(500).send('Serve Error')
    }
});


router.get('/check',auth,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');// return user information except password
        
        if(user.position == 'Admin'){
            res.json({
                author: true
            })
        }else{
            res.json({
                author: false
            })
        }
    } catch (error) {
        res.status(500).send('Serve Error')
    }
});

router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check(
        'password',
        'password is required'
    ).exists()
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()
        });
    }
    
    const {email,password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                errors: [{msg: 'This user is not exist!'}]
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res
                .status(400)
                .json({errors: [{msg: 'This user is not exist!'}]});
        }
        
          // Encrypt password
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
        { expiresIn : 360000},
        (err,token) => {
            if(err) throw err;
            res.json({token: token})
        })
    } catch (error) {
        res.status(500).send('Server error')
    }
});

module.exports = router;

