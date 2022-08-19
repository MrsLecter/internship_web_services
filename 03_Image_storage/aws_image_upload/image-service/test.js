let res =[ 'cat.ico', 'food.ico', 'fruit.ico' ];
let index = res.indexOf("food.ico");
res.splice(index, 1);
console.log( index, res)