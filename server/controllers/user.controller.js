const userModel = require('../data/models/user.model');

const login = function(req, res){
    const body = req.body;
    console.log(body);
    if(!body.username || !body.password){
        res.status(400).json({message:'Invalid username or password'});
    }else{
        const user = userModel.findOne(body.username, body.password);
        if(!user){
            res.status(400).json({message:'Invalid username or password'});
        }else{
            const token = `${user.id}-${user.username}-${Date.now().toString()}`;
            res.status(200).json({message:'Login successful', name: user.username, accessToken: token});
        }
    }
}

module.exports = {
    login
};