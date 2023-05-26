const db = [
    {id:1, username:'user1', password:'12345'},
    {id:2, username:'user2', password:'12345'}
];

const findOne = function(username, password){
    return db.find(u=> u.username == username && u.password == password);
};

const findById = function(userId){
    return db.find(u=> u.id == userId);
};

module.exports = {
    findOne,
    findById
};