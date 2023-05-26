const userModel = require('../data/models/user.model');

const authenticate = function (req, res, next) {
    
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            const userId = token.split('-')[0];
            const user = userModel.findById(userId);
            console.log(userId);
            if(!user){
                res.status(401).json({ message: 'Unauthorized' });
            }else{
                next();
            }
        }
    }
}

module.exports = {
    authenticate
}