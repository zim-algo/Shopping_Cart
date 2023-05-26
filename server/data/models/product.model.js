const db = [
    {id:1, name:'Product 1', price:10.00, stock:5, image:'product1.png'},
    {id:2, name:'Product 2', price:20.00, stock:5, image:'product2.png'},
    {id:3, name:'Product 3', price:30.00, stock:5, image:'product3.png'},
];

const findOne = function(productId){
    return db.find(p=> p.id == productId);
};

const findAll = function(){
    return db;
}

const updateStocks = function(orderItems){
    orderItems.forEach((item)=>{
        const productIndex = db.findIndex(p=> p.id == item.id);
        db[productIndex].stock -= item.quantity;
    });
}


module.exports = {
    findOne,
    findAll,
    updateStocks
};