const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    //  Get token from header
    let token = req.headers.authorization.split(' ')[1]
    
    // Check if not token
    if(token === 'null'){
        return res.status(401).send('Unauthorize request')
    }
    //Verify token
    let payload = jwt.verify(token,config.get('jwtSecret'))
    if(!payload){
        return res.status(401).send('Unauthorize request')
    }
    req.user = payload.user
    next()
    // try{
    //     const decoded = jwt.verify(token,config.get('jwtSecret'))
    //     req.user = decoded.user;
    //     next();
    // }catch(err){
    //     res.status(401).json({msg:'Token is not valid'})
    // }
}